import React, { useState } from "react";
import "./AdminHome.css";

const AdminHome = () => {
  // State for toggling dropdowns
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);
  const [showScreenOptions, setShowScreenOptions] = useState(false); // State for showing add/remove screen options
  const [newScreenName, setNewScreenName] = useState(""); // State for new screen name
  const [screens, setScreens] = useState(["Screen 1", "Screen 2", "Screen 3", "Screen 4"]); // State for screens
  const [removeScreen, setRemoveScreen] = useState(""); // State for selected screen to remove

  // Toggle functions
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleScreens = () => setScreensOpen(!screensOpen);
  const toggleScreenOptions = () => setShowScreenOptions(!showScreenOptions); // Toggle screen options

  // Handle adding a new screen
  const handleAddScreen = () => {
    if (newScreenName) {
      setScreens([...screens, newScreenName]);
      setNewScreenName(""); // Reset input field after adding screen
      setShowScreenOptions(false); // Hide the options
    }
  };

  // Handle removing a screen
  const handleRemoveScreen = () => {
    if (removeScreen) {
      setScreens(screens.filter(screen => screen !== removeScreen));
      setRemoveScreen(""); // Reset the selection after removing
      setShowScreenOptions(false); // Hide options
    }
  };

  return (
    <div className="admin-home-container">
      {/* Side Navigation Bar */}
      <div className="side-nav">
        <div className="nav-section">
          <h2>All Movies</h2>
        </div>
        <div className="nav-section">
          <h2 onClick={toggleCategories}>Categories</h2>
          {/* Categories dropdown */}
          <ul className={categoriesOpen ? "open" : ""}>
            <li>Playing Now</li>
            <li>Top Rated</li>
            <li>Best Movies</li>
          </ul>
        </div>
        <div className="nav-section">
          <h2>All Bookings</h2>
        </div>
        <div className="nav-section">
          <h2 onClick={toggleScreens}>Screens</h2>
          {/* Screens dropdown */}
          <ul className={screensOpen ? "open" : ""}>
            {screens.map((screen, index) => (
              <li key={index}>{screen}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage Movies, Bookings, and Screens from here</p>

        {/* Example of additional content */}
        <div className="content-cards">
          <div className="card">
            <h3>Manage Movies</h3>
            <p>View, add, or update movie details.</p>
          </div>
          <div className="card" onClick={toggleScreenOptions}>
            <h3>Manage Screens</h3>
            <p>Assign movies to screens and showtimes.</p>
          </div>
          
        </div>
        <div className="content-cards">
         
          <div className="card">
            <h3>Manage Bookings</h3>
            <p>View and manage customer bookings.</p>
          </div>
          <div className="card" >
            <h3>Manage Category</h3>
            <p>Assign movies to screens and showtimes.</p>
          </div>
        
        </div>

        {/* Show options for adding/removing screens */}
        {showScreenOptions && (
          <div className="screen-options">
            <button onClick={handleAddScreen}>Add Screen</button>
            <button onClick={handleRemoveScreen}>Remove Screen</button>
          </div>
        )}

        {/* Input field for adding a new screen */}
        {showScreenOptions && (
          <div className="add-screen-input">
            <input
              type="text"
              placeholder="Enter new screen name"
              value={newScreenName}
              onChange={(e) => setNewScreenName(e.target.value)}
            />
          </div>
        )}

        {/* Dropdown for removing a screen */}
        {showScreenOptions && removeScreen === "" && (
          <div className="remove-screen-select">
            <select onChange={(e) => setRemoveScreen(e.target.value)} value={removeScreen}>
              <option value="">Select screen to remove</option>
              {screens.map((screen, index) => (
                <option key={index} value={screen}>{screen}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
