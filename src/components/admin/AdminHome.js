import React, { useState } from "react";
import "./AdminHome.css";

const AdminHome = () => {
  // State for toggling dropdowns
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [screensOpen, setScreensOpen] = useState(false);

  // Toggle functions
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleScreens = () => setScreensOpen(!screensOpen);

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
            <li>Screen 1</li>
            <li>Screen 2</li>
            <li>Screen 3</li>
            <li>Screen 4</li>
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
          <div className="card">
            <h3>Manage Bookings</h3>
            <p>View and manage customer bookings.</p>
          </div>
          <div className="card">
            <h3>Manage Screens</h3>
            <p>Assign movies to screens and showtimes.</p>
          </div>
          {/* <div className="card">
            <h3>Manage Categories</h3>
            <p>Assign movies to screens and showtimes.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
