import React from "react";
import { Navigate } from "react-router-dom";

const GuestProtectedRoute = ({ children }) => {
  // Check localStorage for guest access
  const hasAccess = localStorage.getItem("guestAccess") === "granted";

  if (!hasAccess) {
    // Redirect anyone who hasn't passed GuestGate
    return <Navigate to="/guest-gate" replace />;
  }

  return children;
};

export default GuestProtectedRoute;
