import { HomeMovies, type MovieProps } from "@/components/home-movies";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios, { AxiosError, type AxiosResponse } from "axios";
import type { SignUpSchema } from "../_auth/signup";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/home")({
  component: RouteComponent,
});

type Categories = {
  name: string;
  movies: MovieProps[];
}[];

export function useMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/movies");
      return response.data;
    },
  });
}

export function RouteComponent() {
  const { data } = useMovies();
  const [categories, setCategories] = useState<Categories>([]);

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col px-8 space-y-12">
      {categories?.map((category) => (
        <div
          className="flex flex-col space-y-4"
          key={category.name + "-" + new Date()}
        >
          <h3 className="text-zinc-50 text-3xl font-bold">{category.name}</h3>
          <HomeMovies movies={category.movies} />
        </div>
      ))}
    </div>
  );
}
