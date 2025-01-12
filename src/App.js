import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";
import Header from "./components/Header";
import Home from "./components/home/Home";
import AdminLogin from "./components/admin/AdminLogin";
import AdminHome from "./components/admin/AdminHome";
import ScreenShowManage from "./components/admin/ScreenShowManage";
import NowPlaying from "./components/categories/NowPlaying";
import TicketBooking from "./components/TicketBooking";
import AllBookings from "./components/admin/AllBookings"

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home/>}/>
        {!isLoggedIn && <Route path="/admin-login" element={<AdminLogin />} />}
         <Route path="/now-playing" element={<NowPlaying/>}/>
         <Route path="/ticket-booking" element={<TicketBooking/>}/>
        
        {isLoggedIn && <Route path="/admin-login" element={<AdminHome />} />}
        {isLoggedIn && <Route path="/admin-screens" element={<ScreenShowManage/>}/>}
        {isLoggedIn && <Route path="/all-bookings" element={<AllBookings/>}/>}
      
      </Routes>
    </Router>
  );
}

export default App;
