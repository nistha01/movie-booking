import React, { useEffect, useState } from "react";
import "./NowPlaying.css"; // Ensure this CSS file is imported

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch the JSON file
    fetch("/now-playing.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data); // Set the fetched data into state
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
      });
  }, []);

  return (
    <div>
      {/* "Now Playing" Header */}
      <div className="now-playing-header">Now Playing</div>

      <div className="now-playing-container">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card-container">
            {/* Movie Poster Card */}
            <div className="movie-card">
              <img src={movie.Poster} alt={movie.Title} className="poster" />
              <div className="details-overlay">
                <p>Genre: {movie.Genre}</p>
                <p>Duration: {movie.Duration}</p>
                <p>Language: {movie.Language}</p>
              </div>
            </div>

            {/* Title and Release Date */}
            <div className="movie-details">
              <h3 className="movie-title">{movie.Title}</h3>
              <p className="release-date">Release: {movie.ReleaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
