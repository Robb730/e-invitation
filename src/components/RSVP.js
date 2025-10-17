import React, { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RSVP = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!firstName.trim() || !lastName.trim() || !attendance) {
      setMessage("Please enter your first name, last name, and attendance.");
      return;
    }

    // Use only the first word of first name to prevent "Robb" vs "Robb Jullian" duplicates
    const firstWord = firstName.trim().split(" ")[0];
    const normalizedFullName = `${firstWord} ${lastName.trim()}`.toLowerCase();

    try {
      // Check for duplicates (case-insensitive)
      const q = query(
        collection(db, "responses"),
        where("name_lower", "==", normalizedFullName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setMessage("You’ve already submitted your RSVP. Thank you!");
        return;
      }

      // Add new response
      await addDoc(collection(db, "responses"), {
        firstName: firstWord,
        lastName: lastName.trim(),
        name: `${firstWord} ${lastName.trim()}`,
        name_lower: normalizedFullName,
        attendance,
        timestamp: new Date(),
      });

      setMessage(`Thank you, ${firstWord} ${lastName.trim()}! We’ve noted your response: ${attendance}`);
      setFirstName("");
      setLastName("");
      setAttendance("");
    } catch (error) {
      console.error("Error saving RSVP:", error);
      setMessage("An error occurred while submitting. Please try again later.");
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#CB8587] to-[#8E8B63] text-white text-center">
      <h2 className="text-3xl font-bold mb-6">RSVP</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 max-w-sm mx-auto"
      >
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <select
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          required
        >
          <option value="">Will you attend?</option>
          <option value="Yes, I’ll be there!">Yes, I’ll be there!</option>
          <option value="Sorry, I can’t make it">Sorry, I can’t make it</option>
        </select>

        <button
          type="submit"
          className="bg-[#EDDADA] text-[#CB8587] px-6 py-2 rounded-full font-semibold hover:scale-105 duration-200 shadow-md"
        >
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm bg-white/20 p-2 rounded-lg inline-block">
          {message}
        </p>
      )}
    </section>
  );
};

export default RSVP;
