// src/pages/NewArrivals.js

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const NewArrivals = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 0.8, 0.6]);

  // Enhanced arrivals data
  const arrivals = [
    {
      id: 1,
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-black-dress-walking-in-slow-motion-43115-large.mp4',
      title: 'Silk Evening Dress',
      price: 1299,
      category: 'DRESSES',
      span: 'full',
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90',
      title: 'Cashmere Overcoat',
      price: 1899,
      category: 'OUTERWEAR',
      span: 'half',
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90',
      title: 'Tailored Blazer',
      price: 899,
      category: 'JACKETS',
      span: 'half',
    },
    {
      id: 4,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=90',
      title: 'Wool Trousers',
      price: 549,
      category: 'BOTTOMS',
      span: 'half',
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=90',
      title: 'Leather Boots',
      price: 799,
      category: 'FOOTWEAR',
      span: 'half',
    },
    {
      id: 6,
      type: 'video',
      src: 'https://assets.mixkit.co/videos/preview/mixkit-elegant-woman-in-a-black-dress-4894-large.mp4',
      title: 'Minimalist Collection',
      price: null,
      category: 'CAMPAIGN',
      span: 'full',
    },
  ];

  // Custom cursor
  useEffect(() => {
    const mouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', mouseMove);
    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] relative">
      {/* Custom Cursor - Desktop Only */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: cursorPos.x - 24,
          y: cursorPos.y - 24,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      >
        <div className={`w-full h-full border-2 rounded-full transition-all duration-200 ${isHovering ? 'border-black bg-black/20' : 'border-black'}`} />
      </motion.div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }} />

      {/* Sticky Header */}
      <motion.div 
        style={{ y: headerY, opacity }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xs tracking-[0.3em] font-semibold">
              ARCHIVE 01 <span className="text-gray-400 mx-2">//</span> NEW ARRIVALS
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Hero Text */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-6xl md:text-8xl font-serif italic mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Temporal<br />Vault
          </h2>
          <p className="text-sm tracking-[0.3em] text-gray-500 max-w-md">
            CURATED PIECES FOR THE DISCERNING COLLECTOR
          </p>
        </motion.div>
      </div>

      {/* Broken Editorial Grid */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {arrivals.map((item, index) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              index={index}
              onHover={setIsHovering}
            />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-200 py-16 px-6">
        <div className="max-w-[1800px] mx-auto text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white px-12 py-4 text-xs tracking-[0.3em] font-semibold hover:bg-gray-800 transition-colors"
          >
            VIEW FULL COLLECTION
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

// Product Card Component with Reveal Mask
const ProductCard = ({ item, index, onHover }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const isFull = item.span === 'full';

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${isFull ? 'lg:col-span-2' : 'lg:col-span-1'} group cursor-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onHoverStart={() => {
        setIsHovered(true);
        onHover(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHover(false);
      }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-100 ${isFull ? 'aspect-[16/9]' : 'aspect-[3/4]'}`}>
        {/* Reveal Mask Animation */}
        <motion.div
          className="absolute inset-0 bg-white z-10"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: isInView ? 0 : 1 }}
          transition={{ duration: 0.8, delay: index * 0.15, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: 'bottom' }}
        />

        {/* Video or Image */}
        {item.type === 'video' ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={item.src} type="video/mp4" />
          </video>
        ) : (
          <motion.img
            src={item.src}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}

        {/* Dim Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Mobile Add Button */}
        {item.price && (
          <button className="lg:hidden absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop Phantom UI */}
      <motion.div
        className="hidden lg:block absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-white via-white to-transparent"
        initial={{ y: '100%' }}
        animate={{ y: isHovered ? 0 : '100%' }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        <p className="text-[10px] tracking-[0.3em] text-gray-500 mb-2">{item.category}</p>
        <h3 className="text-2xl font-serif italic mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          {item.title}
        </h3>
        
        {item.price && (
          <div className="flex items-center justify-between">
            <p className="text-sm tracking-wider">${item.price.toLocaleString()}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-3 rounded-full text-xs tracking-[0.2em] font-semibold hover:bg-gray-800 transition-colors"
            >
              ADD TO CART
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Mobile Info (Always Visible) */}
      <div className="lg:hidden mt-4">
        <p className="text-[10px] tracking-[0.3em] text-gray-500 mb-1">{item.category}</p>
        <h3 className="text-xl font-serif italic mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {item.title}
        </h3>
        {item.price && (
          <p className="text-sm tracking-wider">${item.price.toLocaleString()}</p>
        )}
      </div>
    </motion.div>
  );
};

export default NewArrivals;