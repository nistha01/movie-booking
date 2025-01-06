// src/components/Poster.js
import React, { useEffect, useState } from 'react';
import './Poster.css';

const Poster = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    
    const fetchMovies = async () => {
      try {
        const response = await fetch('/movies.json');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Auto-slide every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [movies]);

  return (
    <div className="poster-container">
      <div
        className="poster-slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {movies.map((movie, index) => (
          <div key={index} className="poster-item">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="poster-img"
            />
            <div className="poster-details">
              <h2>{movie.Title}</h2>
              <p>{movie.Plot}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Poster;
