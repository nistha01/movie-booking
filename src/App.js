import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";
import Header from "./components/Header";
import Home from "./components/home/Home";
import AdminLogin from "./components/admin/AdminLogin";
import AdminHome from "./components/admin/AdminHome";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        {!isLoggedIn && <Route path="/admin-login" element={<AdminLogin />} />}
        
        {isLoggedIn && <Route path="/admin-login" element={<AdminHome />} />}
      
      </Routes>
    </Router>
  );
}

export default App;
