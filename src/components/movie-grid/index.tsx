import React from "react";
import { MovieCard } from "../movie-card";
import { Movie } from "@/lib/api";

const MovieGrid: React.FC<{ movies: Movie[] }> = ({ movies }) => {
  console.log("movies", movies);

  if (movies.length === 0)
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">No movies found</p>
      </div>
    );

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
        p-4
      "
    >
      {movies.map((movie) => (
        <MovieCard key={`movie-card-${movie.id}-${Date.now()}`} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
