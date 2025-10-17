import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const GuestGate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const q = query(
      collection(db, "guests"),
      where("firstName", "==", firstName.trim()),
      where("lastName", "==", lastName.trim())
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Valid guest — store names separately in localStorage
      localStorage.setItem("guestAccess", "granted");
      localStorage.setItem("guestFirstName", firstName.trim());
      localStorage.setItem("guestLastName", lastName.trim());

      // Navigate to RSVP page
      navigate("/");
    } else {
      setError("Name not found in the guest list. Please try again.");
    }
  } catch (err) {
    console.error("Error verifying guest:", err);
    setError("Something went wrong. Please try again later.");
  }
};

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#CB8587] to-[#8E8B63] text-white">
      <h2 className="text-3xl font-bold mb-6">Enter Your Name</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white/20 p-8 rounded-2xl shadow-md w-80 text-center space-y-4"
      >
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          required
        />

        <button
          type="submit"
          className="bg-[#EDDADA] text-[#CB8587] px-6 py-2 rounded-full font-semibold hover:scale-105 duration-200 shadow-md"
        >
          Continue
        </button>

        {error && <p className="text-sm text-red-200 mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default GuestGate;
