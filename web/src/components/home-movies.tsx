import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MovieCard } from "./movie-card";

export type StatusEnum = "WATCHED" | "WANT_WATCH" | "IM_WATCHING";

export type MovieProps = {
  id: string;
  title: string;
  photo: string;
  rate: number;
  genres: string[];
  marks: {
    isFavorite: boolean;
    status: StatusEnum;
  };
};

export function HomeMovies({ movies }: { movies: MovieProps[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {movies.map((movie) => (
          <CarouselItem key={movie.title} className="pl-4 basis-auto">
            <MovieCard movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
