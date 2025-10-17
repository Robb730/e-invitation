import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import Countdown from "./components/Countdown";
import Reminders from "./components/Reminders";
import Eighteens from "./components/Eighteens";
import RSVP from "./components/RSVP";
import Admin from "./components/Admin";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestGate from "./components/GuestGate";
import GuestProtectedRoute from "./components/GuestProtectedRoute";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <Router>
      <div className="w-full min-h-screen text-white scroll-smooth">
        <Routes>
          {/* 🎟 Guest Gate (name verification) */}
          <Route path="/guest-gate" element={<GuestGate />} />

          {/* 🎉 Invitation (protected by GuestGate) */}
          <Route
            path="/"
            element={
              <GuestProtectedRoute>
                <>
                  <HeroSection />
                  <Countdown />
                  <Reminders />
                  <Eighteens />
                  <RSVP />
                </>
              </GuestProtectedRoute>
            }
          />

          {/* 🔐 Admin login */}
          <Route
            path="/admin-login"
            element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* 🔒 Protected admin view */}
          <Route
            path="/admin-view-guest"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
