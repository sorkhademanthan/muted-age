// src/pages/NewArrivals.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';

const NewArrivals = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCheckout();
  const [sizeSelections, setSizeSelections] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // New arrivals - Premium luxury items
  const newArrivals = [
    { 
      id: 1, 
      name: 'Draped Cashmere Coat', 
      price: 3490.00, 
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=95',
      description: 'Pure cashmere. Architectural draping.',
      sizes: ['XS', 'S', 'M', 'L']
    },
    { 
      id: 2, 
      name: 'Merino Knit Dress', 
      price: 1890.00, 
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=95',
      description: 'Italian merino. Fluid silhouette.',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    { 
      id: 3, 
      name: 'Structured Leather Jacket', 
      price: 2690.00, 
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1200&q=95',
      description: 'Vegetable-tanned leather. Refined edges.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 4, 
      name: 'Wide-Leg Wool Pants', 
      price: 990.00, 
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=95',
      description: 'Worsted wool. Elongated proportion.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 5, 
      name: 'Silk Oversized Shirt', 
      price: 790.00, 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=1200&q=95',
      description: 'Mulberry silk. Relaxed elegance.',
      sizes: ['XS', 'S', 'M', 'L']
    },
    { 
      id: 6, 
      name: 'Minimalist Leather Tote', 
      price: 1590.00, 
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=95',
      description: 'Full-grain calfskin. Timeless form.',
      sizes: ['One Size']
    },
  ];

  const handleSizeSelect = (productId, size) => {
    setSizeSelections({ ...sizeSelections, [productId]: size });
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const selectedSize = sizeSelections[product.id] || product.sizes[0];
    addToCart(product, selectedSize);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    const selectedSize = sizeSelections[product.id] || product.sizes[0];
    buyNow(product, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      {/* Luxury white with warm undertone */}
      <Header />
      
      {/* Centered Minimal Header */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl"
        >
          {/* Main Headline */}
          <h1 
            className="text-7xl md:text-8xl lg:text-9xl font-light mb-8 tracking-tight"
            style={{ 
              fontFamily: 'Bodoni Moda, Playfair Display, serif',
              letterSpacing: '0.02em'
            }}
          >
            NEW ARRIVALS
          </h1>

          {/* Subtext */}
          <p className="text-[11px] md:text-xs tracking-[0.35em] text-gray-500 font-light mb-12">
            LIMITED RELEASE · DESIGNED TO ENDURE
          </p>

          {/* Ultra-thin divider */}
          <div className="w-32 mx-auto border-t border-gray-300" style={{ opacity: 0.2, borderWidth: '0.5px' }} />
        </motion.div>
      </div>

      {/* Premium Product Grid */}
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.9, 
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1] 
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F0] mb-8">
                {/* Primary Image - Soft Crossfade */}
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ 
                    opacity: hoveredProduct === product.id ? 0 : 1,
                    scale: hoveredProduct === product.id ? 1.02 : 1
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Hover Image - Soft Crossfade */}
                <motion.img
                  src={product.imageHover}
                  alt={`${product.name} detail`}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ 
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    scale: hoveredProduct === product.id ? 1 : 1.02
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Gentle Slide-Up CTA Panel */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-white/98 backdrop-blur-sm px-8 py-6"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ 
                    y: hoveredProduct === product.id ? 0 : '100%',
                    opacity: hoveredProduct === product.id ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {/* Size Selection */}
                  <div className="flex gap-2 justify-center mb-4">
                    {product.sizes.map(size => (
                      <motion.button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeSelect(product.id, size);
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-10 h-10 text-[11px] tracking-wide transition-all duration-300 rounded-sm ${
                          sizeSelections[product.id] === size
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900 border border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <motion.button 
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex-1 bg-white text-gray-900 border border-gray-900 py-3 text-[10px] tracking-[0.25em] font-light rounded-sm hover:bg-gray-50 transition-colors duration-300"
                    >
                      ADD TO CART
                    </motion.button>
                    <motion.button 
                      onClick={(e) => handleBuyNow(product, e)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex-1 bg-gray-900 text-white py-3 text-[10px] tracking-[0.25em] font-light rounded-sm hover:bg-black transition-colors duration-300"
                    >
                      BUY NOW
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Product Information - Refined Typography */}
              <motion.div 
                className="space-y-3 px-1"
                animate={{ 
                  y: hoveredProduct === product.id ? -6 : 0 
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 
                  className="text-lg font-light tracking-wide text-gray-900"
                  style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
                >
                  {product.name}
                </h3>

                <p className="text-[11px] text-gray-500 font-light leading-relaxed tracking-wide">
                  {product.description}
                </p>

                <p className="text-sm text-gray-900 font-light tracking-wide">
                  ${product.price.toFixed(2)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Editorial Section - Halfway Down */}
      <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight"
            style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
          >
            Crafted in Limited Quantities
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Each piece is produced in small batches to preserve exclusivity and attention to detail.
          </p>
        </motion.div>

        {/* Cinematic Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[21/9] bg-[#F5F5F0] overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=95"
            alt="Limited collection"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="max-w-6xl mx-auto px-8 py-24 text-center">
        <motion.button
          onClick={() => navigate('/shop')}
          whileHover={{ x: 4 }}
          className="group inline-flex items-center gap-3 text-sm tracking-[0.25em] text-gray-900 font-light"
        >
          <span className="relative">
            EXPLORE THE COLLECTION
            <span className="absolute left-0 -bottom-1 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-500" />
          </span>
          <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
        </motion.button>
      </div>
    </div>
  );
}

export default NewArrivals;