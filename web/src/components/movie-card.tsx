import { StarIcon } from "lucide-react";
import type { MovieProps, StatusEnum } from "./home-movies";
import { Button } from "./ui/button";
import axios from "axios";

type MovieCardProps = {
  movie: MovieProps;
  cardWidth?: number;
  cardHeight?: number;
};
export const MovieCard = ({ movie, cardHeight, cardWidth }: MovieCardProps) => {
  async function handleMark(movieId: string, status: StatusEnum) {
    await axios.put("http://localhost:3000/movieMarks/mark");
  }

  return (
    <div
      style={{ width: cardWidth ?? 300, height: cardHeight ?? 400 }}
      className={`relative rounded-md overflow-hidden group`}
    >
      <img
        src={movie.photo}
        alt={movie.title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
      />

      {/* Initial Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col space-y-2 justify-end p-4 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="font-semibold text-xl text-white">{movie.title}</h3>
        <div className="w-full flex items-center gap-4">
          <StarIcon className="text-yellow-400" />
          <span className="text-base text-white">{movie.rate}</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="w-full absolute inset-0 bg-black/70 p-4 flex flex-col justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-2xl text-white">{movie.title}</h3>
          <Button variant={"outline"} className="rounded-full">
            {/* <StarIcon className={`w - 6 h - 6 text - white ${movie.marks.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} `} /> */}
          </Button>
        </div>

        <div className="flex items-center gap-4 my-4">
          {/* <span className="text-white text-sm">{movie.genres.join(" / ")}</span> */}
          <div className="flex items-center gap-1">
            <StarIcon className="text-yellow-400 w-5 h-5" />
            <span className="text-white">{movie.rate}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              handleMark(movie.id, "WATCHED");
            }}
          >
            Já assisti
          </Button>
          <Button variant="outline" className="flex-1">
            Quero Assistir
          </Button>
          <Button variant="outline" className="flex-1">
            Assistindo
          </Button>
        </div>
      </div>
    </div>
  );
};
