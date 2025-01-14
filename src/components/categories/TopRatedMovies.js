import React, { useEffect, useState } from "react";
import "./TopRatedMovies.css";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    
    fetch("/now-playing.json")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const scrollCarousel = (direction) => {
    const container = document.getElementById("carousel");
    const scrollAmount = container.offsetWidth;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    setScrollPosition(container.scrollLeft);
  };

  return (
    <div className="movie-section">
      <h1>Top Rated Movies</h1>
      <div className="carousel-container">
        <button
          className={`arrow left ${scrollPosition === 0 ? "hidden" : ""}`}
          onClick={() => scrollCarousel("left")}
        >
          &#8249;
        </button>
        <div className="movies-carousel" id="carousel">
          {movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <img
                src={movie.poster_url}
                alt={movie.nmae}
                className="movie-poster"
              />
              <div className="movie-info">
                <h2>{movie.name}</h2>
                <p>{movie.Plot}</p>
                <div className="buttons">
                  <button className="trailer-btn">Trailer</button>
                  <button className="details-btn">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="arrow right"
          onClick={() => scrollCarousel("right")}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default TopRatedMovies;
