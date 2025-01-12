import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, remove } from "firebase/database";
import { database } from "../database/DatabaseConf";
import "./ScreenShowManage.css";

const ScreenShowManage = () => {
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState("");
  const [newShowtime, setNewShowtime] = useState({ day: "", timeFrom: "", timeTo: "" });
  const [selectedScreenForDelete, setSelectedScreenForDelete] = useState("");

  // Fetch screens from Firebase
  useEffect(() => {
    const screensRef = ref(database, "screens");
    onValue(screensRef, (snapshot) => {
      const data = snapshot.val();
      setScreens(data ? Object.entries(data).map(([id, screen]) => ({ id, ...screen })) : []);
    });

  }, []);

  // Add a showtime to a specific screen
  const handleAddShowtime = () => {
    if (selectedScreenId && newShowtime.day && newShowtime.timeFrom && newShowtime.timeTo) {
      const showtimesRef = ref(database, `screens/${selectedScreenId}/showtimes`);
      const newShowtimeRef = push(showtimesRef);
      set(newShowtimeRef, newShowtime).then(() => {
        setNewShowtime({ day: "", timeFrom: "", timeTo: "" });
      });
    }
  };

  // Remove a showtime from a specific screen
  const handleDeleteShowtime = (screenId, showtimeId) => {
    const showtimeRef = ref(database, `screens/${screenId}/showtimes/${showtimeId}`);
    remove(showtimeRef);
  };

  return (
    <div className="container">
      <h1>Manage Screen Showtimes</h1>

      {/* Add Showtimes Section */}
      <div className="add-section">
        <h2>Add Showtime</h2>
        <select
          value={selectedScreenId}
          onChange={(e) => setSelectedScreenId(e.target.value)}
          className="dropdown"
        >
          <option value="">Select Screen</option>
          {screens.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.name}
            </option>
          ))}
        </select>
        <div className="form-group">
          <select
            value={newShowtime.day}
            onChange={(e) => setNewShowtime({ ...newShowtime, day: e.target.value })}
            className="dropdown"
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <input
            type="time"
            value={newShowtime.timeFrom}
            onChange={(e) => setNewShowtime({ ...newShowtime, timeFrom: e.target.value })}
          />
          <input
            type="time"
            value={newShowtime.timeTo}
            onChange={(e) => setNewShowtime({ ...newShowtime, timeTo: e.target.value })}
          />
        </div>
        <button onClick={handleAddShowtime}>Add Showtime</button>
      </div>

      {/* Screen Cards */}
      <div className="screens">
        {screens.map((screen) => (
          <div key={screen.id} className="screen-card">
            {/* Screen Name */}
            <h3 className="screen-name">{screen.name}</h3>

            {/* Showtimes Header */}
            <h4 className="showtimes-header">Showtimes:</h4>

            {/* Showtimes List with Scroll Feature */}
            {screen.showtimes && Object.keys(screen.showtimes).length > 0 ? (
              <ul className="showtimes-list">
                {Object.entries(screen.showtimes).map(([id, { day, timeFrom, timeTo }]) => (
                  <li key={id} className="showtime-item">
                    <span>{`${day}: ${timeFrom} - ${timeTo}`}</span>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteShowtime(screen.id, id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-showtimes">No showtimes available.</p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ScreenShowManage;
