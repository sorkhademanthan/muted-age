import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
        INDIA: {time.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" })}
      </p>
    </div>
  );
};

const navLinks = [
  { name: "Shop", path: "/shop" },
  { name: "New Arrivals", path: "/newarrivals" },
  { name: "Brand", path: "/brand" },
  { name: "Journal", path: "/journal" },
  { name: "Contact", path: "/contact" }
];

const MainLayout = ({ children }) => {
  const [hoveredLink, setHoveredLink] = useState(null);

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
          {/* <source src="/videofortintd.mp4" type="video/mp4" /> */}
        </video>
      </div>

      {/* CENTERED NAVIGATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>tintd.</h1>
        <nav className="flex flex-col items-center gap-4">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              onHoverStart={() => setHoveredLink(link.name)}
              onHoverEnd={() => setHoveredLink(null)}
              className="relative"
            >
              <Link
                to={link.path}
                className="text-lg text-gray-300 transition-colors duration-300 hover:text-white"
              >
                {link.name}
              </Link>
              {hoveredLink === link.name && (
                <motion.div
                  className="absolute bottom-[-4px] left-0 h-[1px] bg-white"
                  layoutId="underline"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                />
              )}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* PAGE CONTENT */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        {children}
      </div>

      {/* BOTTOM UI BAR */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end z-10">
        <div className="hidden md:block">
          <SpotifyPlayer />
        </div>
        <div className="w-full md:w-auto text-center absolute left-1/2 -translate-x-1/2 bottom-8">
          <Clock />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
