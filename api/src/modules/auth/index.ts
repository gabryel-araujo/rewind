import { eq, or } from "drizzle-orm";
import { Router } from "express";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import bcrypt from "bcryptjs";
import { AuthService } from "./service";
import { FIVE_MINUTES_IN_MS, redis } from "src/common/redis";
import { auth } from "src/config/auth";
import { mail } from "src/common/mail";
import { AuthModel } from "./model";
import { env } from "src/common/env";

export const authRoutes = Router();

authRoutes.post(
  "/signup",
  auth.validate(AuthModel.SIGNUP_STEP_1_SCHEMA),
  async (request, response) => {
    const { username, email } = request.body;
    const [hasCredentialsTaken] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(or(eq(users.email, email), eq(users.name, username)));
    if (hasCredentialsTaken)
      return response
        .status(400)
        .json("Email or username has taken by another user");

    const REDIS_KEY = `codes:${email}`;

    const code = await redis.get(REDIS_KEY);
    if (code)
      return response
        .status(200)
        .json("A code has been already sent to this email.");

    const newCode = AuthService.genCode();
    await Promise.all([
      mail({ to: email, subject: "Rewind | Seu código", text: newCode }),
      redis.setex(REDIS_KEY, FIVE_MINUTES_IN_MS, JSON.stringify(newCode)),
    ]);

    return response.status(200).json();
  }
);

authRoutes.get("/cb", async (request, response) => {
  try {
    const { code } = request.query;

    if (!code || typeof code !== "string") {
      return response
        .status(400)
        .json({ message: "Missing authorization code" });
    }

    const tokenResponse = await fetch(
      `https://${env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: env.AUTH0_CLIENT_ID,
          client_secret: env.AUTH0_CLIENT_SECRET,
          code: code,
          redirect_uri: env.AUTH0_CALLBACK_URL,
        }),
      }
    );

    const tokenData: any = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Failed to fetch token");
    }

    const userInfoResponse = await fetch(
      `https://${env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    //@ts-expect-error
    const userInfo: AuthModel.GithubProfileData | AuthModel.GoogleProfileData =
      await userInfoResponse.json();
    console.log(userInfo);

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const where =
      "email" in userInfo
        ? eq(users.email, userInfo.email)
        : eq(users.authId, userInfo.sub);

    let [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(or(where));

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          //@ts-expect-error
          email: userInfo.email ?? "",
          name: userInfo.nickname || userInfo.name,
          displayName: userInfo.name,
          photo: userInfo.picture,
          authId: userInfo.sub,
        })
        .returning({ id: users.id, email: users.email });
      user = newUser;
    }

    if (!user) {
      return response
        .status(500)
        .json({ message: "Failed to create or find user." });
    }

    const token = auth.sign({ id: user.id, email: user.email });
    response.cookie("movies_auth", token, { httpOnly: true, secure: true });

    return response.json({ ok: true });
  } catch (error) {
    console.error("Auth0 callback error:", error);
    return response.status(500).json({ message: "Authentication failed." });
  }
});

authRoutes.post(
  "/signup/:code",
  auth.validate(AuthModel.SIGNUP_SCHEMA),
  async (request, response) => {
    const { username, email, password } = request.body;

    const REDIS_KEY = `codes:${email}`;
    const { code } = request.params;
    //@ts-expect-error
    const storedCode = JSON.parse(await redis.get(REDIS_KEY));
    if (!storedCode || code !== storedCode)
      return response.status(400).json("Invalid or expired code.");

    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        name: username,
        displayName: "",
        email,
        password: hashed,
      })
      .returning({ id: users.id });
    if (!user) return response.status(500).json("Error to create user.");

    const { id } = user;
    const token = auth.sign({ id, email });

    response.cookie("movies_auth", token, { httpOnly: true, secure: true });

    return response.status(201).json();
  }
);

authRoutes.get("/google", async (_, response) => {
  let url: string | null = null;

  try {
    url = await AuthService.authenticateWithProvider("google");
  } catch (error) {
    console.log(error);
  }

  if (!url)
    return response.status(500).json("Error to generate Oauth Google URL");
  return response.redirect(url);
});

authRoutes.get("/github", async (_, response) => {
  let url: string | null = null;

  try {
    url = await AuthService.authenticateWithProvider("github");
  } catch (error) {
    console.log(error);
  }

  if (!url)
    return response.status(500).json("Error to generate Oauth Github URL");
  return response.redirect(url);
});

authRoutes.post(
  "/code/resend",
  auth.validate(AuthModel.RESEND_CODE_SCHEMA),
  async (request, response) => {
    const { email } = request.body;

    const REDIS_KEY = `codes:${email}`;
    if (await redis.exists(REDIS_KEY)) await redis.del(REDIS_KEY);

    const code = AuthService.genCode();

    await Promise.all([
      mail({ to: email, subject: "Rewind | Seu código", text: code }),
      redis.setex(REDIS_KEY, FIVE_MINUTES_IN_MS, JSON.stringify(code)),
    ]);

    return response.status(200).json();
  }
);

authRoutes.post(
  "/login",
  auth.validate(AuthModel.LOGIN_SCHEMA),
  async (request, response) => {
    const { email, password } = request.body;
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email));
    if (!user)
      return response.status(400).json("There is no user with this email");

    const isPasswordMatch = await bcrypt.compare(password, user.password!);
    if (!isPasswordMatch) return response.status(400).json("Invalid password");

    const token = auth.sign({ id: user.id, email: user.email });

    response.cookie("movies_auth", token, {
      httpOnly: true,
      secure: false,
    });

    return response.status(200).json();
  }
);

authRoutes.post("/logout", async (request, response) => {
  response.clearCookie("movies_auth", {
    httpOnly: true,
    secure: false,
  });

  return response.status(200).json();
});

authRoutes.delete("/delete", async (request, response) => {
  //@ts-expect-error
  const { id: userId } = request.user;

  const { ok } = await AuthService.softDeleteUser(userId);

  response.clearCookie("movies_auth", {
    httpOnly: true,
    secure: false,
  });
  return response.status(200).json({ ok });
});
