import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCheckout();
  const [sizeSelections, setSizeSelections] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Premium luxury products with high-quality imagery
  const products = [
    { 
      id: 1, 
      name: 'Tailored Overcoat', 
      price: 2890.00, 
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=95',
      description: 'Italian wool. Timeless construction.',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    { 
      id: 2, 
      name: 'Cashmere Crewneck', 
      price: 1290.00, 
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=95',
      description: 'Pure cashmere. Effortlessly refined.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 3, 
      name: 'Wool Tailored Trousers', 
      price: 890.00, 
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=95',
      description: 'Structured elegance. Modern fit.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 4, 
      name: 'Leather Tote', 
      price: 1890.00, 
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=95',
      description: 'Full-grain leather. Handcrafted detail.',
      sizes: ['One Size']
    },
    { 
      id: 5, 
      name: 'Silk Minimalist Shirt', 
      price: 690.00, 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=1200&q=95',
      description: 'Japanese silk. Understated luxury.',
      sizes: ['XS', 'S', 'M', 'L']
    },
    { 
      id: 6, 
      name: 'Wide-Leg Denim', 
      price: 590.00, 
      image: 'https://images.unsplash.com/photo-1542272454315-7f6ab6973859?w=1200&q=95',
      imageHover: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1200&q=95',
      description: 'Premium denim. Relaxed silhouette.',
      sizes: ['S', 'M', 'L', 'XL']
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Luxury Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm tracking-[0.3em] text-gray-400 mb-8 font-light">
              NEW COLLECTION '25
            </p>
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-light mb-10 leading-[0.95]"
              style={{ 
                fontFamily: 'Bodoni Moda, Playfair Display, serif',
                letterSpacing: '-0.02em'
              }}
            >
              Timeless
              <br />
              Craftsmanship
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light mb-12 max-w-md mx-auto leading-relaxed">
              Designed to last. Every piece tells a story of dedication and artistry.
            </p>
            <motion.button
              onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] border-b border-black pb-1 hover:opacity-60 transition-opacity duration-500"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              SHOP COLLECTION
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-500" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Premium Product Grid */}
      <div id="collection" className="max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24"
        >
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">CURATED SELECTION</p>
          <h2 
            className="text-4xl md:text-6xl font-light"
            style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
          >
            Essential Pieces
          </h2>
        </motion.div>

        {/* Luxury Product Grid - Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group cursor-pointer"
            >
              {/* Premium Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
                {/* Primary Image */}
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ 
                    opacity: hoveredProduct === product.id ? 0 : 1,
                    scale: hoveredProduct === product.id ? 1.03 : 1
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Hover Image - Slow Fade */}
                <motion.img
                  src={product.imageHover}
                  alt={`${product.name} detail`}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ 
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    scale: hoveredProduct === product.id ? 1 : 1.03
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Premium Slide-Up CTA Panel */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-6"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ 
                    y: hoveredProduct === product.id ? 0 : '100%',
                    opacity: hoveredProduct === product.id ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: hoveredProduct === product.id ? 0.1 : 0
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-11 h-11 text-xs tracking-wider transition-all duration-300 ${
                          sizeSelections[product.id] === size
                            ? 'bg-black text-white border border-black'
                            : 'bg-white text-black border border-gray-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Premium CTA Buttons */}
                  <div className="space-y-3">
                    <motion.button 
                      onClick={(e) => handleBuyNow(product, e)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-black text-white py-3.5 text-xs tracking-[0.25em] font-light hover:bg-gray-900 transition-colors duration-300"
                    >
                      BUY NOW
                    </motion.button>
                    <motion.button 
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-black border border-black py-3.5 text-xs tracking-[0.25em] font-light hover:bg-gray-50 transition-colors duration-300"
                    >
                      ADD TO CART
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Premium Product Information */}
              <motion.div 
                className="space-y-3"
                animate={{ 
                  y: hoveredProduct === product.id ? -8 : 0 
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 
                  className="text-lg font-light tracking-wide text-gray-900"
                  style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
                >
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {product.description}
                </p>

                <p className="text-base text-gray-900 font-light">
                  ${product.price.toFixed(2)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Brand Values Section */}
      <div className="bg-gray-50 py-32 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-sm tracking-[0.25em] mb-4 font-light">COMPLIMENTARY SHIPPING</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Worldwide delivery on all orders
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-sm tracking-[0.25em] mb-4 font-light">EFFORTLESS RETURNS</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              30-day return policy on all items
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-sm tracking-[0.25em] mb-4 font-light">TIMELESS QUALITY</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Crafted to endure, designed to inspire
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;