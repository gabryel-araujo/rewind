import { Router } from "express";
import { auth } from "src/config/auth";
import { UserService } from "./service";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import { eq } from "drizzle-orm";
import { Bucket } from "src/common/bucket";
import z from "zod";
import { env } from "src/common/env";

export const userRoutes = Router();

userRoutes.get(
  "/movies",
  auth.authenticate,
  async (request, response) => {
    // @ts-expect-error
    const { id: userId } = request.user;

    const movies = UserService.getUserMovies(userId);
    return response.json(movies);
  }
);

userRoutes.get("/@me",
  auth.authenticate,
  async (request, response) => {
    //@ts-expect-error
    const { id: userId } = request.user;

    const [user] = await db.select({
      name: users.name,
      photo: users.photo,
      email: users.email,
    })
      .from(users)
      .where(eq(users.id, userId));
    if (!user) return response.status(400).json("Unknown User");
    const { photo: hash, email, name } = user;

    return response.json({ photo: `${env.R2_PUBLIC_URL}/avatars/${userId}/${hash}.webp`, name, email });
  }
)

userRoutes.post(
  "/photo",
  auth.authenticate,
  async (request, response) => {
    //@ts-expect-error
    const { id: userId } = request.user;

    const { route, hash } = await Bucket.genPresignedUrl(`avatars/ ${userId}`);

    await db.update(users).set({
      photo: hash,
    }).where(
      eq(users.id, userId!)
    );

    return response.json({ route });
  }
)

userRoutes.delete("/photo",
  auth.authenticate,
  async (request, response) => {
    //@ts-expect-error
    const { id: userId } = request.user;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId!),
      columns: { photo: true }
    });

    if (!user) return response.status(404).json('Unknown user');

    const { ok } = await Bucket.remove(`avatars / ${userId} / ${user.photo}`)

    if (ok) await db.update(users)
      .set({ photo: '' })
      .where(
        eq(users.id, userId!)
      )

    return response.json({ ok });
  }
)

userRoutes.put("/",
  auth.authenticate,
  async (request, response) => {

  });

userRoutes.delete("/",
  auth.authenticate,
  async (request, response) => {
    //@ts-expect-error
    const { id: userId } = request.user;

    const { ok } = await UserService.softDeleteUser(userId);

    return response.json({ ok });
  }
)

