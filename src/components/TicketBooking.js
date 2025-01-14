import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import "./TicketBooking.css";
import emailjs from 'emailjs-com';

const TicketBooking = () => {
    const [currentView, setCurrentView] = useState("menu");
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
    const [dobEmail, setDobEmail] = useState({ dob: "", email: "" });
    const [userTickets, setUserTickets] = useState([]);
    const [numberOfTickets, setNumberOfTickets] = useState(1);

    // Send email function
    const sendEmail = async (userDetails, selectedMovie, selectedTiming, numberOfTickets) => {
        const message = `
            Dear ${userDetails.name},

            Thank you for booking your movie ticket with us!

            Movie Name: ${selectedMovie.name}
            Movie Description: ${selectedMovie.description || "No description available"}
            Showtime: ${selectedTiming}
            Number of Tickets: ${numberOfTickets}
            Date: ${new Date().toLocaleDateString()}

            We hope you enjoy the movie!

            Best Regards,
            Movie Booking Team
        `;

        const templateParams = {
            from_name: userDetails.name,
            to_email: userDetails.email, // Use the email from the form input
            message: message, // Movie booking details wrapped in message
        };

        try {
            const response = await emailjs.send(
                'service_jl6efbg',       // Your Service ID
                'template_kvipexe',      // Your Template ID
                templateParams,          // Email content (name, message, etc.)
                'SbbFOPagbp9VIbgHj'      // Your User ID
            );
        
            console.log('Email sent successfully:', response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

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
        e.preventDefault(); // Prevent form submission
        
        if (!selectedMovie || !selectedTiming) {
            alert("Please select a movie and timing.");
            return;
        }

        const ticketData = {
            ...userDetails,
            movie: selectedMovie.name,
            timing: selectedTiming,
            numberOfTickets, // Add number of tickets to the ticket data
        };

        try {
            const db = getDatabase();
            await push(ref(db, "users"), ticketData);
            alert("Ticket booked successfully!");

            // Send the email after booking the ticket
            sendEmail(userDetails, selectedMovie, selectedTiming, numberOfTickets);

            // Reset form state
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
                    <button
                        style={{ marginLeft: "220px" }}
                        onClick={() => setCurrentView("book")}
                    >
                        Book Tickets
                    </button>
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
        </div>
    );
};

export default TicketBooking;
