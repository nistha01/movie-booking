import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import getDatabase

const firebaseConfig = {
  apiKey: "AIzaSyAuhWVPRFZTjeusq__hFDwkmwnllDNUEog",
  authDomain: "movie-booking-866a6.firebaseapp.com",
  databaseURL: "https://movie-booking-866a6-default-rtdb.firebaseio.com",
  projectId: "movie-booking-866a6",
  storageBucket: "movie-booking-866a6.appspot.com", // Corrected domain
  messagingSenderId: "282561028561",
  appId: "1:282561028561:web:fd3afcb9d1dca0eff340f0",
  measurementId: "G-K6KB9PTP5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Database

// Get the Auth instance
const auth = getAuth(app);

export { auth, database };
