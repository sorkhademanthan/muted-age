import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  // Glitch animation variants
  const glitchVariants = {
    normal: {
      x: 0,
      y: 0,
      textShadow: '0 0 0 transparent',
    },
    glitch: {
      x: [0, -5, 5, -5, 0],
      y: [0, 2, -2, 2, 0],
      textShadow: [
        '0 0 0 transparent',
        '2px 2px 0 #ff0000, -2px -2px 0 #00ff00',
        '-2px 2px 0 #0000ff, 2px -2px 0 #ff0000',
        '0 0 0 transparent',
      ],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
        {/* 404 Number with glitch effect */}
        <motion.div
          className="mb-12"
          variants={glitchVariants}
          initial="normal"
          animate="glitch"
        >
          <h1
            className="text-[20vw] md:text-[15vw] font-serif leading-none text-transparent"
            style={{
              fontFamily: 'Playfair Display, serif',
              WebkitTextStroke: '2px white',
              letterSpacing: '0.05em',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Cryptic message */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="text-2xl md:text-3xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            This coordinate is empty.
          </p>
          <p className="text-sm tracking-[0.3em] text-gray-500">
            SILENCE FOUND HERE
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('/new-arrivals')}
          className="group relative px-12 py-4 border-2 border-white text-white text-xs tracking-[0.3em] font-semibold overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-300">
            RETURN TO THE VAULT
          </span>
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.button>

        {/* Coordinates display */}
        <motion.div
          className="absolute bottom-12 font-mono text-xs text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ERROR_CODE: NULL_REFERENCE | TIMESTAMP: {new Date().toISOString()}
        </motion.div>
      </div>

      {/* Ambient noise/grain effect */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid lines */}
      <div className="fixed inset-0 pointer-events-none z-5" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
      `}</style>
    </div>
  );
};

export default NotFound;
    