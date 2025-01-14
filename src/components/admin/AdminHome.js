import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { Link } from "react-router-dom";
import "./AdminHome.css";
import { ref, set, onValue } from "firebase/database";
import { database } from "../database/DatabaseConf";

const AdminHome = () => {
  const { logout } = useAuth();
  const [screens, setScreens] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState({});
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [selectedItemToRemove, setSelectedItemToRemove] = useState("");
  const [newMovie, setNewMovie] = useState({
    name: "",
    releaseDate: "",
    category: "",
    type: "",
    genre: "",
    director: "",
    actor: "",
    language: "",
    imdbRating: "",
    showtime: "",
    trailerLink: "",
    poster_url: "",
    description: "",
    screen: "",
  });

  const database1 = database;

  // Fetch data from Firebase
  useEffect(() => {
    const screensRef = ref(database1, "screens");
    const categoriesRef = ref(database1, "categories");
    const moviesRef = ref(database1, "movies");

    onValue(screensRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const screenList = Object.values(data); // Extract screen objects
        setScreens(screenList);

        // Fetch showtimes for each screen
        const screenShowtimes = {};
        screenList.forEach((screen) => {
          if (screen.name) {
            screenShowtimes[screen.name] = screen.showtimes ? Object.values(screen.showtimes) : [];
          }
        });

        setShowtimes(screenShowtimes);
        console.log(screenShowtimes[newMovie.screen]); // Log showtimes for the selected screen
      }
    });

    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      setCategories(data ? Object.values(data) : []);
    });

    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      setMovies(data ? Object.values(data) : []);
    });
  }, [database1]);

  // Save data to Firebase
  const saveToDatabase = (key, items) => {
    const dbRef = ref(database1, key);
    set(dbRef, items.reduce((acc, item, index) => ({ ...acc, [index]: item }), {}));
  };
  //logout function
  const logoutt=()=>{
    logout();
  }

  // Toggle dropdowns
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleScreens = () => setScreensOpen(!screensOpen);

  const handleClick = (event) => {
    toggleScreens();
  };

  const handleAddItem = () => {
    if (!newItemName) return;

    if (modalType === "screens") {
      const updatedScreens = [...screens, { name: newItemName }];
      setScreens(updatedScreens);
      saveToDatabase("screens", updatedScreens);
    }

    if (modalType === "categories") {
      const updatedCategories = [...categories, newItemName];
      setCategories(updatedCategories);
      saveToDatabase("categories", updatedCategories);
    }

    setNewItemName("");
    setModalType(null);
  };

  // Remove an item
  const handleRemoveItem = () => {
    if (!selectedItemToRemove) return;

    if (modalType === "screens") {
      const updatedScreens = screens.filter((screen) => screen.name !== selectedItemToRemove);
      setScreens(updatedScreens);
      saveToDatabase("screens", updatedScreens);
    }

    if (modalType === "categories") {
      const updatedMovies = movies.filter((movie) => movie.category !== selectedItemToRemove);
      const updatedCategories = categories.filter((cat) => cat !== selectedItemToRemove);
      setCategories(updatedCategories);
      setMovies(updatedMovies);
      saveToDatabase("categories", updatedCategories);
      saveToDatabase("movies", updatedMovies);
    }

    setSelectedItemToRemove("");
  };

  // Add a new movie
  const handleAddMovie = () => {
    if (Object.values(newMovie).some((val) => !val)) return;

    // Add the screen and showtime for "Now Playing" category
    if (newMovie.category === "Now Playing" && !newMovie.screen && !newMovie.showtime) {
      return; // Prevent adding the movie if these fields are empty for "Now Playing"
    }

    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    saveToDatabase("movies", updatedMovies);

    setNewMovie({
      name: "",
      releaseDate: "",
      category: "",
      type: "",
      genre: "",
      director: "",
      actor: "",
      language: "",
      imdbRating: "",
      showtime: "",
      trailerLink: "",
      poster_url: "",
      description: "",
      screen: "", 
    });

    setModalType(null);
  };

  return (
    <div className="admin-home-container">
      <div className="side-nav">
        <div className="nav-section">
          <h2 onClick={toggleCategories}>Categories</h2>
          <ul className={categoriesOpen ? "open" : ""}>
            {categories.length > 0 ? (
              categories.map((category, index) => <li key={index}>{category}</li>)
            ) : (
              <li>No Categories Available</li>
            )}
          </ul>
        </div>
        <div className="nav-section">
          <Link to="/admin-screens" onClick={handleClick} style={{ textDecoration: "none", color: "white" }}>
            <h2 style={{ cursor: "pointer", color: "white" }}>Screens</h2>
          </Link>
          <ul className={screensOpen ? "open" : ""}>
            {screens.length > 0 ? (
              screens.map((screen, index) => <li key={index}>{screen.name}</li>)
            ) : (
              <li>No Screens Available</li>
            )}
          </ul>
        </div>
        <div className="nav-section">
        <Link to="/all-bookings" onClick={handleClick} style={{ textDecoration: "none", color: "white" }}>
            <h2 style={{ cursor: "pointer", color: "white" }}>All Bookings</h2>
          </Link>

        </div>
        <button className="logout-button" onClick={logoutt}>Logout</button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>

        <div className="content-cards">
          <div className="card" onClick={() => setModalType("screens")}>
            <h3>Manage Screens</h3>
            <h4>Add or Remove Screens</h4>
          </div>
          <div className="card" onClick={() => setModalType("categories")}>
            <h3>Manage Categories</h3>
            <h4>Add or Remove Categories</h4>
          </div>
          <div className="card" onClick={() => setModalType("movies")}>
            <h3>Manage Movies</h3>
            <h4>Add or Remove Movies</h4>
          </div>
        </div>
      </div>

      {/* Modal for Managing Screens, Categories, and Movies */}
      {modalType && (
        <div className="modal">
          <div className="modal-content">
            <h2>Manage {modalType}</h2>
            {modalType === "movies" ? (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={newMovie.name}
                  onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Release Date"
                  value={newMovie.releaseDate}
                  onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                />
                <select
                  value={newMovie.category}
                  onChange={(e) => setNewMovie({ ...newMovie, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {newMovie.category === "Now Playing" && (
                  <>
                    {/* Screen Selection (multiple) */}
                    <select
                      value={newMovie.screen}
                      onChange={(e) => setNewMovie({ ...newMovie, screen: Array.from(e.target.selectedOptions, option => option.value) })}
                      multiple
                    >
                      <option value="">Select Screen</option>
                      {screens.map((screen, index) => (
                        <option key={index} value={screen.name}>
                          {screen.name}
                        </option>
                      ))}
                    </select>

                    {/* Showtime Selection with Checkboxes */}
                    {newMovie.screen.length > 0 && showtimes && showtimes[newMovie.screen] && Array.isArray(showtimes[newMovie.screen]) ? (
                      <div>
                        <p>Select Showtime(s):</p>
                        {showtimes[newMovie.screen].map((time, index) => (
                          <div key={index} className="checkbox-container">
                            <input
                              type="checkbox"
                              id={`showtime-${index}`}
                              value={`${time.day}: ${time.timeFrom} - ${time.timeTo}`}
                              checked={newMovie.showtime.includes(`${time.day}: ${time.timeFrom} - ${time.timeTo}`)}
                              onChange={(e) => {
                                const selectedShowtimes = e.target.checked
                                  ? [...newMovie.showtime, e.target.value]
                                  : newMovie.showtime.filter(showtime => showtime !== e.target.value);
                                setNewMovie({ ...newMovie, showtime: selectedShowtimes });
                              }}
                            />
                            <label htmlFor={`showtime-${index}`}>
                              {time.day}: {time.timeFrom} - {time.timeTo}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No showtimes available for the selected screen.</p>
                    )}
                  </>
                )}

                <input
                  type="text"
                  placeholder="Type"
                  value={newMovie.type}
                  onChange={(e) => setNewMovie({ ...newMovie, type: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Genre"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Director"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Actor"
                  value={newMovie.actor}
                  onChange={(e) => setNewMovie({ ...newMovie, actor: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Language"
                  value={newMovie.language}
                  onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="IMDB Rating"
                  value={newMovie.imdbRating}
                  onChange={(e) => setNewMovie({ ...newMovie, imdbRating: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Trailer Link"
                  value={newMovie.trailerLink}
                  onChange={(e) => setNewMovie({ ...newMovie, trailerLink: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Poster URL"
                  value={newMovie.poster_url}
                  onChange={(e) => setNewMovie({ ...newMovie, poster_url: e.target.value })}
                />
                <button onClick={handleAddMovie}>Save Movie</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <button onClick={handleAddItem}>Add {modalType}</button>
                <select
                  value={selectedItemToRemove}
                  onChange={(e) => setSelectedItemToRemove(e.target.value)}
                >
                  <option value="">Select {modalType} to Remove</option>
                  {modalType === "screens" && screens.map((screen, index) => (
                    <option key={index} value={screen.name}>
                      {screen.name}
                    </option>
                  ))}
                  {modalType === "categories" && categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button onClick={handleRemoveItem}>Remove {modalType}</button>
              </>
            )}
            <button onClick={() => setModalType(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
