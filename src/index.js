import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import App from "./App";
import { AuthProvider } from "./components/context/AuthContext"; 

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root using createRoot
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
