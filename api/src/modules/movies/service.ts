import {
  and,
  eq,
  ilike,
  inArray,
  or,
  sql
} from "drizzle-orm";
import { db } from "src/db/client";
import { genres } from "src/db/schema/genres";
import { movieMarks } from "src/db/schema/movieMarks";
import { movies } from "src/db/schema/movies";
import { moviesGenres } from "src/db/schema/moviesGenres";
import { actors as actorsSchema } from "src/db/schema/actors";
import { moviesActors } from "src/db/schema/moviesActors";

type FilterMovieOptions = {
  limit: number;
  genreIds?: string[];
  actorIds?: string[];
  releaseYear?: number;
  search?: string;
};

export class MovieService {

  public static async filterMovies({
    search,
    limit,
    actorIds,
    genreIds,
    releaseYear,
  }: FilterMovieOptions) {
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(movies.name, `%${search}%`),
          ilike(movies.originalTitle, `%${search}%`),
          ilike(movies.overview, `%${search}%`)
        )
      );
    }

    if (releaseYear) {
      conditions.push(
        eq(sql`extract(year from ${movies.releasedAt})`, releaseYear)
      );
    }

    if (genreIds && genreIds.length > 0) {
      const genreSubquery = db
        .select({ movieId: moviesGenres.movieId })
        .from(genres)
        .leftJoin(moviesGenres, eq(genres.id, moviesGenres.genreId))
        .where(inArray(genres.id, genreIds));

      conditions.push(inArray(movies.id, genreSubquery));
    }

    if (actorIds && actorIds.length > 0) {
      const actorSubquery = db
        .select({ movieId: moviesActors.movieId })
        .from(actorsSchema)
        .leftJoin(moviesActors, eq(actorsSchema.id, moviesActors.actorId))
        .where(inArray(actorsSchema.id, actorIds));


      conditions.push(inArray(movies.id, actorSubquery));
    }

    const finalConditions = and(...conditions);

    const query = db.select().from(movies).where(finalConditions).limit(limit);

    const filteredMovies = await query;

    return filteredMovies;
  }

  public static async getMoviesGroupedByGenre() {
    const query = sql`
      SELECT
        g.name,
        json_agg(m.*) as movies
      FROM genres g
      LEFT JOIN movies_genres mg ON g.id = mg.genre_id
      LEFT JOIN movies m ON mg.movie_id = m.id
      GROUP BY g.name;
    `;

    const moviesByGenre = await db.execute(query);

    return moviesByGenre;
  }

  public static async getUserMovies(userId: string) {
    const userMovies = await db
      .select({
        id: movies.id,
        name: movies.name,
        overview: movies.overview,
        tagline: movies.tagline,
        photo: movies.photo,
        backdropPhoto: movies.backdropPhoto,
        imdbId: movies.imdbId,
        status: movies.status,
        originalTitle: movies.originalTitle,
        budget: movies.budget,
        revenue: movies.revenue,
        popularity: movies.popularity,
        runtime: movies.runtime,
        voteAverage: movies.voteAverage,
        releasedAt: movies.releasedAt,
        mark: movieMarks.status,
        isFavorite: movieMarks.isFavorite
      })
      .from(movieMarks)
      .where(eq(movieMarks.userId, userId))
      .leftJoin(movies, eq(movieMarks.movieId, movies.id));

    return userMovies;
  }

  public static async getMovie(movieId: string) {
    const query = sql`
      SELECT
        m.*,
        json_agg(pc.*) as production_companies,
        json_agg(poc.*) as production_countries
      FROM movies m
      LEFT JOIN movies_production_companies mpc ON m.id = mpc.movie_id
      LEFT JOIN production_companies pc ON mpc.company_id = pc.id
      LEFT JOIN movies_production_countries mpoc ON m.id = mpoc.movie_id
      LEFT JOIN production_countries poc ON mpoc.country_id = poc.id
      WHERE m.id = ${movieId}
      GROUP BY m.id;
    `;

    const [movie] = await db.execute(query);

    return movie;
  }
}
