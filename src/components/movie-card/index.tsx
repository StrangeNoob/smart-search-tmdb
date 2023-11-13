import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Movie } from "@/lib/api";
import { IMAGE_BASE_URL } from "@/lib/api";

import { Calendar, Rocket, StarsIcon, User2Icon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card>
      <CardHeader className="text-center">{movie.title}</CardHeader>
      <CardContent>
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.src = "/assets/placeholder.jpg";
          }}
        />
        <p className="capitalize truncate mt-5 ">{movie.overview}</p>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between flex-col">
          <p className="text-muted-foreground flex gap-x-2">
            <Calendar />
            <span className="font-bold">Release Date:</span>{" "}
            {movie.release_date}
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <Rocket />
            <span className="font-bold">Popularity:</span> {movie.popularity}
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <StarsIcon />
            <span className="font-bold">Rating:</span> {movie.vote_average}
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <User2Icon />
            <span className="font-bold">Vote Count:</span> {movie.vote_count}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

const LoadingMovieCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="text-center">
        <Skeleton className="w-[300px] h-[10px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-[300px] h-[400px]" />
      </CardContent>
      <CardFooter>
        <div className="flex justify-between flex-col">
          <p className="text-muted-foreground flex gap-x-2">
            <Calendar />
            <span className="font-bold">Release Date:</span>{" "}
            <Skeleton className="w-[100px]" />
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <Rocket />
            <span className="font-bold">Popularity:</span>{" "}
            <Skeleton className="w-[100px]" />
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <StarsIcon />
            <span className="font-bold">Rating:</span>{" "}
            <Skeleton className="w-[100px]" />
          </p>
          <p className="text-muted-foreground flex gap-x-2">
            <User2Icon />
            <span className="font-bold">Vote Count:</span>{" "}
            <Skeleton className="w-[100px]" />
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export { MovieCard, LoadingMovieCard };
