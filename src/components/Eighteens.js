import React from "react";

const categories = {
  "18 Roses": ["Dad", "Tito Jay", "Kuya Mark", "..."],
  "18 Candles": ["Bestfriend", "Cousin A", "Cousin B", "..."],
  "18 Blue Bills": ["Uncle Roy", "Lolo", "..."],
  "18 Gifts": ["Mom’s Friend", "Tita May", "..."],
  "18 Shots": ["College Friends", "Kuya’s Barkada", "..."],
};

const Eighteens = () => {
  return (
    <section className="py-12 bg-[#EDDADA] text-[#8E8B63] text-center">
      <h2 className="text-3xl font-bold mb-8">The 18s</h2>
      <div className="max-w-lg mx-auto space-y-4">
        {Object.entries(categories).map(([title, names]) => (
          <details
            key={title}
            className="bg-white/80 shadow-md rounded-lg p-4 text-left"
          >
            <summary className="font-semibold text-lg cursor-pointer text-[#CB8587]">
              {title}
            </summary>
            <ul className="mt-2 list-disc list-inside text-[#8E8B63]/90">
              {names.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Eighteens;
