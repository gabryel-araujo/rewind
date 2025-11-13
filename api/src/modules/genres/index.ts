import { Router } from "express";
import { FIVE_MINUTES_IN_MS, redis } from "src/common/redis";
import { db } from "src/db/client";
import { genres } from "src/db/schema/genres";
import z from "zod";

export const genreRoutes = Router()

const GET_GENRES_SCHEMA = z.object({
  limit: z.optional(z.coerce.number()).default(20),
})

genreRoutes.get(
  "/",
  async (request, response) => {
    const { limit } = GET_GENRES_SCHEMA.parse(request.query);

    const REDIS_KEY = 'genres';
    if (await redis.exists(REDIS_KEY)) return response.send(JSON.parse(await redis.get(REDIS_KEY) as string));

    const genreList = await db
      .select()
      .from(genres)
      .limit(limit);

    await redis.setex(REDIS_KEY, FIVE_MINUTES_IN_MS, JSON.stringify(genreList))

    return response.status(200).json(genreList);
  }
)
