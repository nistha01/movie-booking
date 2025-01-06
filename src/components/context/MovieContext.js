import React, { createContext, useContext, useState } from "react";

// Create the context
const MovieContext = createContext();

// Create a provider component
export const MovieProvider = ({ children }) => {
  const [movies] = useState([
    {
      Title: "Inception",
      Poster: "https://m.media-amazon.com/images/I/51ShKkg6dsL._AC_SY679_.jpg",
      ReleaseDate: "July 16, 2010",
      Genre: "Action, Sci-Fi",
      Duration: "2 hours 28 minutes",
      Language: "English",
    },
    {
      Title: "The Dark Knight",
      Poster: "https://m.media-amazon.com/images/I/51zUbui+gbL._AC_SY679_.jpg",
      ReleaseDate: "July 18, 2008",
      Genre: "Action, Drama",
      Duration: "2 hours 32 minutes",
      Language: "English",
    },
    // Add more movies as needed
  ]);

  return (
    <MovieContext.Provider value={movies}>{children}</MovieContext.Provider>
  );
};

// Custom hook for consuming the MovieContext
export const useMovies = () => {
  return useContext(MovieContext);
};
