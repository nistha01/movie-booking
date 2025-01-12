import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../database/DatabaseConf"; 
import NowPlaying from "../categories/NowPlaying";
import TopRatedMovies from "../categories/TopRatedMovies";
import Poster from "./Poster";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [groupedMovies, setGroupedMovies] = useState({});

  useEffect(() => {
    const moviesRef = ref(database, "movies");

    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      setMovies(data ? Object.values(data) : []);
    });
  }, []);

  useEffect(() => {
    const grouped = movies.reduce((acc, movie) => {
      if (!acc[movie.category]) {
        acc[movie.category] = [];
      }
      acc[movie.category].push(movie);
      return acc;
    }, {});
    setGroupedMovies(grouped);
  }, [movies]);

  return (
    <>
      <Poster />
      <NowPlaying />
      <TopRatedMovies />

      {Object.keys(groupedMovies).map((category, index) => (
        <div key={index} className="category-section">
          <h2 className="category-header">{category}</h2>
          <div className="category-separator"></div>
          <div className="movie-container">
            {groupedMovies[category].map((movie, idx) => (
              <div key={idx} className="movie-wrapper">
                {/* Movie Card */}
                <div className="movie-card">
                  <div className="poster-container">
                    <img src={movie.poster_url} alt={movie.name} className="poster" />
                  </div>
                  <div className="movie-info">
                    <p className="release-date">Release Date: {movie.releaseDate}</p>
                    <p className="genre">Genre: {movie.genre}</p>
                    <p className="director">Director: {movie.director}</p>
                    <p className="actor">Actor: {movie.actor}</p>
                    <p className="language">Language: {movie.language}</p>
                    <p className="imdbRating">IMDB Rating: {movie.imdbRating}</p>
                    <p className="showtime">Showtime: {movie.showtime}</p>
                    <p className="description">Description: {movie.description}</p>
                  </div>
                </div>

                {/* Movie Name and Trailer Button */}
                <div className="movie-trailer-section">
                  <h3 className="movie-title">{movie.name}</h3>
                  <button
                    className="trailer-button"
                    onClick={() => window.open(movie.trailerLink, "_blank", "noopener noreferrer")}
                  >
                    Watch Trailer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Home;
