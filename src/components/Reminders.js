import React from "react";

const Reminders = () => {
  return (
    <section className="py-12 bg-[#D6D4AD] text-[#8E8B63] text-center">
      <h2 className="text-3xl font-bold mb-6">Reminders</h2>
      <ul className="space-y-3 max-w-md mx-auto">
        <li className="bg-white/70 p-3 rounded-lg shadow">
          Dress Code: White Semi-Formal
        </li>
        <li className="bg-white/70 p-3 rounded-lg shadow">
          Arrive before 4:30 PM
        </li>
        <li className="bg-white/70 p-3 rounded-lg shadow">
          Venue: 8 Waves | Mt. Carmel Hall
        </li>
        <li className="bg-white/70 p-3 rounded-lg shadow italic">
          Gifts are gladly appreciated!
        </li>
      </ul>
    </section>
  );
};

export default Reminders;
