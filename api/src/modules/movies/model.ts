import z from "zod";

export namespace MoviesModel {
  export const GET_MOVIES_QUERY = z.object({
    limit: z.optional(z.coerce.number()).default(20),
    search: z.optional(z.string()),
    genres: z.optional(
      z.preprocess(
        (val) => typeof val === "string" && val.length > 3 ? val.split(",").filter(Boolean) : val,
        z.array(z.string()).optional()
      )
    ),
    actors: z.optional(
      z.preprocess(
        (val) => typeof val === "string" && val.length > 3 ? val.split(",").filter(Boolean) : val,
        z.array(z.string()).optional()
      )
    ),
    releaseYear: z.optional(z.coerce.number()),
  })

  export type MovieRequest = {
    title: string;
    photo: string;
    release_date: string;
    poster_path: string;
  }
}
