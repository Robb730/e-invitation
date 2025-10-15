import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react'; // npm install lucide-react
import front from './images/PSP_5671.JPG';
import music from './music/song.mp3';

function HeroSection() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      className="h-screen bg-left-top bg-center flex flex-col justify-end items-center text-center px-4 pb-12 relative text-white"
      style={{ backgroundImage: `url(${front})` }}
    >
      {/* Background music */}
      <audio ref={audioRef} src={music} loop />

      {/* Floating Glass Play/Pause Button (fixed) */}
      <button
        onClick={togglePlay}
        className="fixed top-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center 
                   bg-white/20 backdrop-blur-lg border border-white/40 
                   shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {isPlaying ? (
          <Pause className="text-white w-6 h-6" />
        ) : (
          <Play className="text-white w-6 h-6" />
        )}
      </button>

      {/* Text content */}
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl w-[90%] md:w-[60%]">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 font-great">
          Reese Margaux <br /> A decade and eight.
        </h1>
        <p className="text-lg md:text-xl mb-4">
          Join us in celebrating her special day
        </p>
        <p className="text-md italic">
          November 15, 2025 | 5:00 PM | 8 Waves | Mt. Carmel Hall
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
