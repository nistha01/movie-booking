import React, { useState, useEffect } from "react";
import "./TopRatedMovies.css";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); 

  


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
        setMovies(data); 
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
      });
  }, []);


  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movie-slider">
      <h2 className="slider-title">Top movies in theatres</h2>
      <div className="slider-container">
        <button className="nav-button prev-button" onClick={handlePrev}>
          &larr;
        </button>
        <div className="slider-wrapper">
          {movies.map((movie, index) => (
            <div
              key={index}
              className={`slider-item ${
                index === currentIndex ? "active" : ""
              }`}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
              />
              {index === currentIndex && (
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>Release: {movie.releaseDate}</p>
                  <div className="movie-actions">
                    <button>Trailer</button>
                    <button>Detail</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="nav-button next-button" onClick={handleNext}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default TopRatedMovies;
