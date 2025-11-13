import { Router } from "express";
import { auth } from "src/config/auth";
import { MovieService } from "./service";
import { z } from "zod";
import { db } from "src/db/client";
import { movies } from "src/db/schema/movies";
import { eq, sql } from "drizzle-orm";
import { movieMarks } from "src/db/schema/movieMarks";
import { FIVE_MINUTES_IN_MS, redis } from "src/common/redis";
import { MoviesModel } from "./model";

export const movieRoutes = Router();

movieRoutes.get(
  "/",
  //auth.authenticate,
  async (_, response) => {
    const REDIS_KEY = 'movies';
    if (await redis.exists(REDIS_KEY)) response.send(
      JSON.parse(await redis.get(REDIS_KEY) as string)
    );

    const movies = await MovieService.getMoviesGroupedByGenre();

    await redis.setex(REDIS_KEY, FIVE_MINUTES_IN_MS, JSON.stringify(movies));
    return response.send(movies);
  });

movieRoutes.get(
  "/filter"
  , async (request, response) => {
    const payload = MoviesModel
      .GET_MOVIES_QUERY.parse(request.query);

    const { limit, releaseYear, actors, genres, search } = payload;

    const movies = await MovieService.filterMovies({
      limit,
      actorIds: actors ?? [],
      genreIds: genres ?? [],
      releaseYear,
      search,
    });
    return response.send(movies);
  });

movieRoutes.get("/user", auth.authenticate, async (request, response) => {
  // @ts-ignore
  const { id: userId } = request.user;

  const movies = await MovieService.getUserMovies(userId);
  return response.send(movies);
});

movieRoutes.get("/:movieId", async (request, response) => {
  const { movieId } = z.object({
    movieId: z.uuid()
  }).parse(request.params);

  const movieById = await db.query.movies.findFirst({
    where: eq(movies.id, movieId)
  });
  if (!movieById) return response.status(400).json("Invalid movie.");

  const movie = await MovieService.getMovie(movieId);
  return response.send(movie);
});

movieRoutes.get(
  "/count",
  auth.authenticate,
  async (request, response) => {
    //@ts-expect-error
    const { id: userId } = request.user;
    const REDIS_KEY = `user:${userId}:stats`

    if (await redis.exists(REDIS_KEY)) response.status(200).json(await redis.get(REDIS_KEY));

    const [statistics] = await db.select({
      moviesWatched: sql<number>`count(CASE WHEN ${movieMarks.status} = 'WATCHED' THEN 1 END)`.mapWith(Number),
      moviesWatching: sql<number>`count(CASE WHEN ${movieMarks.status} = 'IM_WATCHING' THEN 1 END)`.mapWith(Number),
      moviesFavorited: sql<number>`count(CASE WHEN ${movieMarks.isFavorite} = true THEN 1 END)`.mapWith(Number)
    }).from(movieMarks)
      .where(eq(movieMarks.userId, userId))

    await redis.setex(REDIS_KEY, FIVE_MINUTES_IN_MS, JSON.stringify(statistics))

    return response.status(200).json(statistics);
  }
)
