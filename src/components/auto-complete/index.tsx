import { useState } from "react";

import { Movie } from "@/lib/api";
import { setLocalStorageItem } from "@/lib/storage";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";

type AutocompleteProps = {
  search: string;
  handleSearch: (value: string) => void;
  suggestion: Movie[];
  recentlyViewed: {
    [key: number]: Movie;
  };
  handleRecentlySearchMovies: (value: Movie) => void;
};

const Autocomplete = ({
  search,
  handleSearch,
  suggestion,
  recentlyViewed,
  handleRecentlySearchMovies,
}: AutocompleteProps) => {
  console.log("suggestion", suggestion);

  const [enableSuggestion, setEnableSuggestion] = useState(false);

  console.log(enableSuggestion && Object.values(recentlyViewed).length > 0);

  return (
    <Command
      placeholder="Search for a movie..."
      className="w-1/2 border rounded-lg shadow-md"
    >
      <CommandInput
        onValueChange={(e) => {
          handleSearch(e);
          if (e.length > 2) setEnableSuggestion(true);
          else setEnableSuggestion(false);
        }}
        value={search}
        className=""
      />

      <CommandList className="flex flex-col">
        {
          // Recently viewed
          enableSuggestion && Object.keys(recentlyViewed).length > 0 && (
            <CommandGroup heading="Recently viewed" className="px-5">
              {Object.values(recentlyViewed).map((movie: Movie) => (
                <CommandItem
                  key={`recently-viewed-${movie.id}`}
                  className="hover:bg-gray-200 cursor-pointer px-5"
                  onSelect={() => {
                    handleSearch(movie.title);
                    setEnableSuggestion(false);
                  }}
                >
                  {movie.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        }
        {
          // Separator
          enableSuggestion && Object.values(recentlyViewed).length > 0 && (
            <CommandSeparator alwaysRender />
          )
        }
        {
          // Suggestion
          suggestion.length > 0 && (
            <CommandGroup heading="Suggestion" className="px-5">
              {enableSuggestion &&
                suggestion.map((movie: Movie) => (
                  <CommandItem
                    key={`sugestion-${movie.id}`}
                    className="hover:bg-gray-200 cursor-pointer px-5"
                    onSelect={() => {
                      handleSearch(movie.title);
                      setLocalStorageItem("recentlySearchMovies", movie);
                      handleRecentlySearchMovies(movie);
                      setEnableSuggestion(false);
                    }}
                  >
                    {movie.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          )
        }
      </CommandList>
    </Command>
  );
};

export default Autocomplete;
