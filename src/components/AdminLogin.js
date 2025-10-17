import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig"; // make sure firebaseConfig exports 'app'


const AdminLogin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate("/admin-view-guest");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err.message);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#CB8587] to-[#8E8B63] text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Login</h2>

      <form
        onSubmit={handleLogin}
        className="bg-white/20 p-8 rounded-2xl shadow-md w-80 text-center space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-[#EDDADA] text-[#CB8587] px-6 py-2 rounded-full font-semibold hover:scale-105 duration-200 shadow-md"
        >
          Login
        </button>

        {error && <p className="text-sm text-red-200 mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default AdminLogin;
