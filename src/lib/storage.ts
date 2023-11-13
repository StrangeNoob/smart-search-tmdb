import { Movie } from "@/lib/api";

export const getLocalStorageItem = (
  key: string
): {
  [key: number]: Movie;
} => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

export const setLocalStorageItem = (key: string, value: Movie) => {
  const movies = getLocalStorageItem(key);
  if (movies) {
    localStorage.setItem(
      key,
      JSON.stringify({ ...movies, [value.id]: { ...value } })
    );
  } else {
    localStorage.setItem(key, JSON.stringify({ [value.id]: { ...value } }));
  }
};

export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
