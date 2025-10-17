import React, { useState, useEffect } from "react";

const Countdown = () => {
  const targetDate = new Date("2025-11-15T17:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
      if (distance < 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-[#EDDADA] to-[#CB8587] text-[#8E8B63] text-center">
      <h2 className="text-3xl font-semibold mb-6 font-great">
        Countdown to the Big Day
      </h2>

      <div className="flex justify-center space-x-3 sm:space-x-6 px-4 text-lg sm:text-xl">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div
            key={unit}
            className="bg-white/70 rounded-lg p-3 sm:p-4 shadow-md w-[70px] sm:w-[110px] flex flex-col items-center"
          >
            <span className="block text-2xl sm:text-4xl font-bold text-[#CB8587]">
              {timeLeft[unit] ?? 0}
            </span>
            <span className="uppercase text-xs sm:text-sm tracking-wider">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </section>


  );
};

export default Countdown;
