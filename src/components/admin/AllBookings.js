// MovieBookings.jsx
import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { database } from "../database/DatabaseConf"; 
import "./AllBooking.css"; 

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const dbRef = ref(database, "users");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const bookingsData = [];

          Object.keys(data).forEach((userId) => {
            const user = data[userId];
            if (user.movie) {
              bookingsData.push({
                userId,
                name: user.name,
                movie: user.movie,
                timing: user.timing,
                
              });
            }
          });

          setBookings(bookingsData);
        } else {
          console.log("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="movie-booking-container">
      <h2>Movie Bookings</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div>
          {bookings.length === 0 ? (
            <p className="no-bookings-message">No bookings available.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.userId} className="booking-item">
                <h3>{booking.name}</h3>
                <p><strong>Movie:</strong> {booking.movie}</p>
                <p><strong>Timing:</strong> {booking.timing}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
