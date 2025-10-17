import React from "react";
import roses from "./images/18_Roses.png";
import lamps from "./images/18_Lamps.png";

const Eighteens = () => {
  return (
    <div className="flex flex-col items-center m-0 p-0">
      <img
        src={roses}
        alt="18 Roses"
        className="w-full object-contain m-0 p-0"
      />
      <img
        src={lamps}
        alt="18 Lamps"
        className="w-full object-contain m-0 p-0"
      />
    </div>
  );
};

export default Eighteens;
