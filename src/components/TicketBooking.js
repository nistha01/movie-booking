import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import "./TicketBooking.css"; // Import the scoped CSS file

const TicketBooking = () => {
    const [currentView, setCurrentView] = useState("menu"); // Tracks current view (menu, book, show)
    const [userDetails, setUserDetails] = useState({
        name: "",
        lastName: "",
        dob: "",
        mobile: "",
        email: "",
    });

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedTiming, setSelectedTiming] = useState("");
    const [dobEmail, setDobEmail] = useState({ dob: "", email: "" }); // For retrieving tickets
    const [userTickets, setUserTickets] = useState([]); // Retrieved tickets
    const [numberOfTickets, setNumberOfTickets] = useState(1);

    // Fetch movies on component mount
    useEffect(() => {
        const fetchMovies = async () => {
            const db = getDatabase();
            const dbRef = ref(db, "movies"); // Reference to the 'movies' node
            try {
                const snapshot = await get(dbRef); // Get the data from Firebase
                if (snapshot.exists()) {
                    const moviesData = snapshot.val();
                    // Filter movies where category is 'Now Playing'
                    const nowPlayingMovies = Object.values(moviesData).filter(
                        (movie) => movie.category === "Now Playing"
                    );
                    setMovies(nowPlayingMovies); // Set the filtered movies to the state
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMovies();
    }, []);

    // Handle form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleMovieChange = (e) => {
        const movieName = e.target.value;
        const movie = movies.find((movie) => movie.name === movieName);
        setSelectedMovie(movie);
        setSelectedTiming("");
    };

    // Submit ticket booking form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMovie || !selectedTiming) {
            alert("Please select a movie and timing.");
            return;
        }

        const ticketData = {
            ...userDetails,
            movie: selectedMovie.name,
            timing: selectedTiming,
        };

        try {
            const db = getDatabase();
            await push(ref(db, "users"), ticketData);
            alert("Ticket booked successfully!");
            setUserDetails({
                name: "",
                lastName: "",
                dob: "",
                mobile: "",
                email: "",
            });
            setSelectedMovie(null);
            setSelectedTiming("");
        } catch (error) {
            console.error("Error booking ticket:", error);
            alert("Failed to book ticket.");
        }
    };

    // Retrieve tickets based on DOB and email
    const handleRetrieveTickets = async (e) => {
        e.preventDefault();
        const { dob, email } = dobEmail;

        if (!dob || !email) {
            alert("Please provide both DOB and email.");
            return;
        }

        try {
            const db = getDatabase();
            const usersRef = ref(db, "users");
            const usersQuery = query(usersRef, orderByChild("dob"), equalTo(dob));

            const snapshot = await get(usersQuery);

            const tickets = [];
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.email === email) {
                    // If both dob and email match, fetch the ticket
                    const ticket = {
                        name: user.name,
                        lastName: user.lastName,
                        mobile: user.mobile,
                        email: user.email,
                        dob: user.dob,
                        movie: user.movie || 'N/A', // Handle if movie data is available or not
                        timing: user.timing || 'N/A', // Handle if timing data is available or not
                    };
                    tickets.push(ticket);
                }
            });

            if (tickets.length === 0) {
                alert("No tickets found for the provided DOB and email.");
            } else {
                setUserTickets(tickets);
            }
        } catch (error) {
            console.error("Error retrieving tickets:", error);
            alert("Failed to retrieve tickets.");
        }
    };


    return (
        <div className="ticket-booking-container">
            <h2>Movie Ticket Booking Counter</h2>

            {currentView === "menu" && (
                <div>
                    <button onClick={() => setCurrentView("book")}>Book Tickets</button>
                    <button onClick={() => setCurrentView("show")}>Show My Tickets</button>
                </div>
            )}

            {currentView === "book" && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={userDetails.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={userDetails.dob}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Mobile Number:
                        <input
                            type="tel"
                            name="mobile"
                            value={userDetails.mobile}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Select Movie:
                        <select
                            value={selectedMovie?.name || ""}
                            onChange={handleMovieChange}
                            required
                        >
                            <option value="" disabled>
                                Select a movie
                            </option>
                            {movies.map((movie) => (
                                <option key={movie.name} value={movie.name}>
                                    {movie.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {selectedMovie && (
                        <label>
                            Select Timing:
                            <select
                                value={selectedTiming}
                                onChange={(e) => setSelectedTiming(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a timing
                                </option>
                                {selectedMovie.showtime.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </label>

                    )}
                    <div className="ticket-selection">
                        <label>
                            Number of Tickets:
                            <input
                                type="number"
                                min="1"
                                value={numberOfTickets}
                                onChange={(e) => setNumberOfTickets(e.target.value)}
                            />
                        </label>
                    </div>

                    <button type="submit">Book Ticket</button>
                    <button type="button" onClick={() => setCurrentView("menu")}>
                        Back to Menu
                    </button>
                </form>
            )}

            {currentView === "show" && (
                <form onSubmit={handleRetrieveTickets}>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={dobEmail.dob}
                            onChange={(e) => setDobEmail({ ...dobEmail, dob: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={dobEmail.email}
                            onChange={(e) =>
                                setDobEmail({ ...dobEmail, email: e.target.value })
                            }
                            required
                        />
                    </label>
                    <button type="submit">Find Tickets</button>
                    <button type="button" onClick={() => setCurrentView("menu")}>
                        Back to Menu
                    </button>
                </form>
            )}

            {userTickets.length > 0 && (
                <div>
                    <h3>Your Tickets:</h3>
                    <ul>
                        {userTickets.map((ticket, index) => (
                            <li key={index}>
                                Movie: {ticket.movie}, Timing: {ticket.timing}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TicketBooking;
