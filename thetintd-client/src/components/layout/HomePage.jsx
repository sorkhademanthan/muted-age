// src/pages/HomePage.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- UI Section Components ---

const SpotifyPlayer = () => (
  <div className="flex items-center gap-4 bg-[#121212] bg-opacity-80 backdrop-blur-sm p-2 rounded-lg text-white">
    <iframe
      src="https://open.spotify.com/embed/track/4hr9wwMN4yYE9nQRWiwERh?utm_source=generator"
      width="300"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      title="Spotify Player"
      className="rounded-lg"
    ></iframe>
  </div>
);

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest">
        INDIA: {time.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })}
      </p>
    </div>
  );
};

// --- High-End Scramble Animation Link ---

const AnimatedLink = ({ title, path }) => {
    const intervalRef = useRef(null);
    const [displayText, setDisplayText] = useState(title);
    const chars = "!<>-_\\/[]{}—=+*^?#_";

    const scramble = () => {
        let counter = 0;
        intervalRef.current = setInterval(() => {
            const newText = title
                .split("")
                .map((char, index) => {
                    if (index < counter) {
                        return title[index];
                    }
                    if (char === " ") return " ";
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            setDisplayText(newText);

            if (counter >= title.length) {
                clearInterval(intervalRef.current);
                setDisplayText(title);
            }
            counter += 1 / 3; // Controls the speed of the reveal
        }, 30);
    };

    const handleHoverStart = () => {
        clearInterval(intervalRef.current);
        scramble();
    };

    const handleHoverEnd = () => {
        clearInterval(intervalRef.current);
        setDisplayText(title);
    };

    return (
        <motion.div
            className="relative"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
        >
            <Link to={path} className="text-xl md:text-2xl text-gray-300 transition-colors duration-300 hover:text-white font-mono tracking-wide">
                {displayText}
            </Link>
        </motion.div>
    );
};


// --- Main HomePage Component ---

const HomePage = () => {
  const navLinks = [
    { name: "Shop", path: "/shop" },
    { name: "New Arrivals", path: "/newarrivals" },
    { name: "Brand", path: "/brand" },
    { name: "Journal", path: "/journal" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
          src="/videofortintd.mp4"
        >
        </video>
      </div>

      {/* CENTERED NAVIGATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>tintd.</h1>
        <nav className="flex flex-col items-center gap-2">
            {navLinks.map((link) => (
                <AnimatedLink key={link.name} title={link.name} path={link.path} />
            ))}
        </nav>
      </div>

      {/* BOTTOM UI BAR */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex justify-between items-end z-10">
        {/* Spotify Player is hidden on small screens */}
        <div className="hidden md:block">
          <SpotifyPlayer />
        </div>
        <div className="w-full md:w-auto text-center absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8">
           <Clock />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
