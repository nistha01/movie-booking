import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">My Movie Site</div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/now-playing">Now Playing</Link>
          </li>
          <li>
            <Link to="/admin-login">Admin Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
