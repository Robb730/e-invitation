import React, { useState } from "react";

const RSVP = () => {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${name}! We’ve noted your response: ${attendance}`);
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
          placeholder="Your Name"
          className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
    </section>
  );
};

export default RSVP;
