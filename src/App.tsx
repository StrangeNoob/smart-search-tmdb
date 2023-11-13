import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import {
  ArrowBigUpDashIcon,
  LucideIcon,
  Rocket,
  StarsIcon,
  User2Icon,
} from "lucide-react";

import { Movie, getMovieGenres, getPopularMovies } from "@/lib/api";
import { getLocalStorageItem } from "@/lib/storage";

import Autocomplete from "@/components/auto-complete";
import { ThemeProvider } from "@/components/theme/rpovider";
import MovieGrid from "@/components/movie-grid";
import { SortFilter } from "@/components/sort-filter";
import { LoadingMovieCard } from "@/components/movie-card";
import BadgeFilter from "@/components/badge-filter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SortParams = {
  value: string;
  label: string;
  icon: LucideIcon;
};

function App() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(search, 300);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filterMovies, setFilterMovies] = useState<Movie[]>([]);
  const [selectedSortParams, setSelectedSortParams] =
    useState<SortParams | null>(null);

  const [recentlySearchMovies, setRecentlySearchMovies] = useState<{
    [key: number]: Movie;
  }>([]);

  const sortingParams: SortParams[] = [
    {
      value: "title",
      label: "A-Z",
      icon: ArrowBigUpDashIcon,
    },
    {
      value: "popularity",
      label: "Popularity",
      icon: Rocket,
    },
    {
      value: "vote_count",
      label: "Vote Count",
      icon: User2Icon,
    },
    {
      value: "vote_average",
      label: "Rating",
      icon: StarsIcon,
    },
  ];

  const fetchData = async (): Promise<{
    movieData: Movie[];
    genreData: { id: number; name: string }[];
  }> => {
    const movieAllResponse = await Promise.all([
      getPopularMovies(1),
      getPopularMovies(2),
      getPopularMovies(3),
      getPopularMovies(4),
      getPopularMovies(5),
    ]);

    const genreData = await getMovieGenres();

    const movieData = movieAllResponse
      .flat()
      .reduce((acc: { [key: number]: Movie }, movie) => {
        acc[movie.id] = movie;
        return acc;
      }, {});
    return { genreData, movieData: Object.values(movieData) };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["initialQuery"],
    queryFn: fetchData,
    retry: false,
  });

  const [badge, setBadge] = useState<{
    [key: number]: {
      value: number;
      name: string;
      type: string;
      isSelected: boolean;
    };
  }>({});

  const [badgeFilter, setBadgeFilter] = useState<{
    [key: number]: {
      value: number;
      name: string;
      type: string;
      isSelected: boolean;
    };
  }>({});

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleBadge = (value: number) => {
    const newBadge = { ...badge };
    newBadge[value].isSelected = !newBadge[value].isSelected;
    setBadge(newBadge);

    // Update the badge filter state
    let newBadgeFilter: {
      [key: number]: {
        value: number;
        name: string;
        type: string;
        isSelected: boolean;
      };
    } = {};
    if (newBadge[value].isSelected) {
      newBadgeFilter = { ...badgeFilter, [value]: newBadge[value] };

      // If there is new badge filter and no
    } else {
      newBadgeFilter = { ...badgeFilter };
      delete newBadgeFilter[value];
    }

    setBadgeFilter(newBadgeFilter);
  };

  const handleSortParams = (value: SortParams) => {
    setSelectedSortParams(value);

    console.log(
      debouncedSearchTerm.length > 2
        ? "Search Movies"
        : Object.keys(badgeFilter).length > 0
        ? "Tag Movies"
        : "All Movies"
    );

    const moviesToFilter =
      debouncedSearchTerm.length > 2
        ? filterMovies!
        : Object.keys(badgeFilter).length > 0
        ? filterMovies!
        : movies;

    const sortedMovies = moviesToFilter.sort(
      //@ts-expect-error value is a string
      (a, b) => b[value.value] - a[value.value]
    );

    setFilterMovies(sortedMovies);
  };

  const handleRecentlySearchMovies = (movie: Movie) => {
    setRecentlySearchMovies({
      ...recentlySearchMovies,
      [movie.id]: movie,
    });
  };

  const searchMovies = (movies: Movie[], search: string) => {
    const options = {
      keys: ["title"],
      threshold: 0.3,
      includeScore: true,
    };
    const fuse = new Fuse(movies, options);
    const result = fuse.search(search);
    console.log("Fuzy Search Result", result);
    return result.map((item) => item.item);
  };

  useEffect(() => {
    const val = searchMovies(movies, debouncedSearchTerm);
    console.log("val", val);
    console.log("debounceSearchTerm", debouncedSearchTerm);
    setFilterMovies(val);
  }, [debouncedSearchTerm, movies]);

  useEffect(() => {
    if (Object.keys(badgeFilter).length === 0) {
      if (debouncedSearchTerm.length > 2) return;
      setFilterMovies([]);
      return;
    }

    const allSelectedAreYears = Object.values(badgeFilter).every(
      (badge) => badge.type === "year"
    );

    const allSelectedAreGenre = Object.values(badgeFilter).every(
      (badge) => badge.type === "genre"
    );

    // Function to check if a movie matches the selected badges
    const isMovieMatch = (movie: Movie) => {
      const year = new Date(movie.release_date).getFullYear();
      const matchesYear = badgeFilter[year];
      const matchesGenre = movie.genre_ids.some((genre) => badgeFilter[genre]);

      return allSelectedAreYears && allSelectedAreGenre
        ? matchesYear || matchesGenre
        : allSelectedAreYears && !allSelectedAreGenre
        ? matchesYear || matchesGenre
        : allSelectedAreGenre && !allSelectedAreYears
        ? matchesGenre || matchesYear
        : matchesGenre && matchesYear;
    };

    // Filter movies based on updated badge filter
    console.log("movies", movies);
    console.log("filterMovies", filterMovies);
    const moviesToFilter =
      debouncedSearchTerm.length > 2 ? filterMovies! : movies;
    const filteredMovies = moviesToFilter.filter(isMovieMatch);
    console.log("filteredMovies", filteredMovies);

    if (selectedSortParams) {
      console.log("selectedSortParams", selectedSortParams);
      const sortedMovies = filteredMovies.sort(
        //@ts-expect-error value is a string
        (a, b) => b[selectedSortParams.value] - a[selectedSortParams.value]
      );
      console.log("sortedMovies", sortedMovies);
      setFilterMovies(sortedMovies);
      return;
    }
    // Update the filtered movies state
    setFilterMovies(filteredMovies);
  }, [badgeFilter, movies]);

  useEffect(() => {
    if (!data) return;
    const { movieData, genreData } = data;

    const genreMap: { [key: number]: string } = {};
    genreData.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });
    const movieGenres: number[] = [];
    const releaseYear = new Set<number>();

    movieData.forEach((movie) => {
      movieGenres.push(...movie.genre_ids);
      const year = new Date(movie.release_date).getFullYear();
      releaseYear.add(year);
    });
    console.log("originalMovie", movieData);
    setMovies(movieData);
    const badgeObject: {
      [key: number]: {
        value: number;
        name: string;
        type: string;
        isSelected: boolean;
      };
    } = {};

    [...new Set(movieGenres)].sort().forEach((genre) => {
      badgeObject[genre] = {
        value: genre,
        name: genreMap[genre],
        type: "genre",
        isSelected: false,
      };
    });
    [...releaseYear]
      .sort((a, b) => b - a)
      .forEach((year) => {
        badgeObject[year] = {
          value: year,
          name: year.toString(),
          type: "year",
          isSelected: false,
        };
      });
    setBadge(badgeObject);
  }, [data]);

  useEffect(() => {
    const movies = getLocalStorageItem("recentlySearchMovies");
    if (movies) {
      console.log("recently movies", movies);
      setRecentlySearchMovies(Object.values(movies));
    }
  }, []);

  return (
    <ThemeProvider>
      {/* {isLoading && (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <PuffLoader color="#36d7b7" />
        </div>
      )} */}
      {error && (
        <div className="flex justify-center items-center h-screen w-screen">
          <Card className="flex items-center justify-center flex-col">
            <CardHeader className="text-center">Error: {error.name}</CardHeader>
            <CardContent>
              <p className="capitalize truncate mt-5 ">{error.message}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="flex flex-col justify-center items-center mt-5">
        <div className="flex justify-center flex-col md:flex-row gap-y-2 items-center md:space-x-4 w-full">
          <div className="hidden md:flex-1 " />
          <Autocomplete
            search={search}
            handleSearch={handleSearch}
            suggestion={filterMovies || []}
            recentlyViewed={recentlySearchMovies}
            handleRecentlySearchMovies={handleRecentlySearchMovies}
          />
          <div className="hidden md:flex-1 " />
          <SortFilter
            sortParams={sortingParams}
            handleSortParams={handleSortParams}
            selectedSortParams={selectedSortParams}
          />
          <div className="hidden md:flex-1 " />
        </div>
        {isLoading ? (
          <div className="flex flex-wrap mt-5 justify-center gap-x-5">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton key={index} className="w-[50px] h-[20px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <BadgeFilter badge={Object.values(badge)} handleBadge={handleBadge} />
        )}
        {isLoading ? (
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
            {Array.from({ length: 20 }).map((_, index) => (
              <LoadingMovieCard key={index} />
            ))}
          </div>
        ) : (
          <MovieGrid
            movies={
              debouncedSearchTerm.length > 2
                ? filterMovies
                : Object.keys(badgeFilter).length > 0
                ? filterMovies
                : movies
            }
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
