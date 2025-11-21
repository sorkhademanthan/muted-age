import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Plus } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction detection for smart header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const categories = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];

  // Uniform products - all same structure
  const products = [
    { 
      id: 1, 
      brand: 'MUTED AGE',
      name: 'Oversized Blazer', 
      price: 1890.00, 
      category: 'Outerwear', 
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90&sat=-100',
      tag: 'NEW',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 2, 
      brand: 'MUTED AGE',
      name: 'Cashmere Turtleneck', 
      price: 890.00, 
      category: 'Tops', 
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=90&sat=-100',
      tag: '',
      sizes: ['XS', 'S', 'M', 'L']
    },
    { 
      id: 3, 
      brand: 'MUTED AGE',
      name: 'Tailored Wool Trousers', 
      price: 1290.00, 
      category: 'Bottoms', 
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=90&sat=-100',
      tag: '',
      sizes: ['S', 'M', 'L', 'XL']
    },
    { 
      id: 4, 
      brand: 'MUTED AGE',
      name: 'Leather Structured Bag', 
      price: 2890.00, 
      category: 'Accessories', 
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=90&sat=-100',
      tag: 'EXCLUSIVE',
      sizes: ['One Size']
    },
    { 
      id: 5, 
      brand: 'MUTED AGE',
      name: 'Double-Breasted Coat', 
      price: 3490.00, 
      category: 'Outerwear', 
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90&sat=-100',
      tag: 'NEW',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    { 
      id: 6, 
      brand: 'MUTED AGE',
      name: 'Silk Minimalist Shirt', 
      price: 690.00, 
      category: 'Tops', 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=90&sat=-100',
      tag: '',
      sizes: ['S', 'M', 'L']
    },
    { 
      id: 7, 
      brand: 'MUTED AGE',
      name: 'Wide-Leg Denim', 
      price: 890.00, 
      category: 'Bottoms', 
      image: 'https://images.unsplash.com/photo-1542272454315-7f6ab6973859?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1542272454315-7f6ab6973859?w=800&q=90&sat=-100',
      tag: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    { 
      id: 8, 
      brand: 'MUTED AGE',
      name: 'Minimalist Timepiece', 
      price: 4890.00, 
      category: 'Accessories', 
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90',
      imageHover: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90&sat=-100',
      tag: 'SOLD OUT',
      sizes: ['One Size']
    },
  ];

  // Filter logic
  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const sizeMatch = selectedSize === 'All' || p.sizes.includes(selectedSize);
    return categoryMatch && sizeMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-32 px-6 text-center">
        <motion.h1 
          className="text-7xl md:text-9xl font-light tracking-[0.3em] mb-6"
          style={{ fontFamily: 'Didot, serif' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          COLLECTION
        </motion.h1>
        <p className="text-sm tracking-[0.4em] text-gray-400">FALL/WINTER 2024</p>
      </div>

      {/* Smart Sticky Header */}
      <motion.div 
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200"
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
          <p className="text-xs tracking-widest text-gray-500">
            {filteredProducts.length} PRODUCTS
          </p>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white text-xs tracking-widest hover:bg-gray-800 transition-colors"
          >
            <Filter size={14} />
            FILTER
          </button>
        </div>
      </motion.div>

      {/* Swiss-Style Strict Editorial Grid */}
      <div className="max-w-[1800px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group cursor-pointer"
            >
              {/* Image Container - Tall Portrait 3:4 Aspect Ratio */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                {/* Tag/Badge */}
                {product.tag && (
                  <div className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] px-2 py-1 tracking-[0.2em]">
                    {product.tag}
                  </div>
                )}

                {/* Primary Image */}
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Hover Image (Crossfade) */}
                <motion.img
                  src={product.imageHover}
                  alt={`${product.name} detail`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />

                {/* Desktop Quick Add Bar (Slides up on hover) */}
                <motion.div
                  className="hidden md:flex absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 flex-col gap-3 border-t border-gray-200"
                  initial={{ y: '100%' }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Size Bubbles */}
                  <div className="flex gap-2 justify-center flex-wrap">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        className="w-10 h-10 border border-gray-300 text-xs tracking-wider hover:bg-black hover:text-white hover:border-black transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  
                  {/* Quick Add Button */}
                  <button className="w-full bg-black text-white py-2.5 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors">
                    QUICK ADD
                  </button>
                </motion.div>

                {/* Mobile Add Button */}
                <motion.button
                  className="md:hidden absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              {/* Product Info - Typography Hierarchy */}
              <div className="space-y-1">
                {/* Brand Name - Small, Uppercase, Wide Tracking */}
                <p className="text-xs tracking-widest text-gray-500 uppercase">
                  {product.brand}
                </p>

                {/* Product Name - Serif, Clean */}
                <h3 className="font-serif text-sm text-gray-900 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>

                {/* Price */}
                <p className="text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                  <h2 
                    className="text-3xl tracking-wider"
                    style={{ fontFamily: 'Didot, serif' }}
                  >
                    FILTER & SORT
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-12">
                  <h3 className="text-xs tracking-[0.3em] text-gray-500 mb-6">CATEGORY</h3>
                  <div className="space-y-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-4 py-3 text-sm tracking-wider transition-colors ${
                          selectedCategory === cat
                            ? 'bg-black text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="mb-12">
                  <h3 className="text-xs tracking-[0.3em] text-gray-500 mb-6">SIZE</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 text-sm tracking-wider transition-colors ${
                          selectedSize === size
                            ? 'bg-black text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-12">
                  <h3 className="text-xs tracking-[0.3em] text-gray-500 mb-6">SORT BY</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="featured">FEATURED</option>
                    <option value="price-low">PRICE: LOW TO HIGH</option>
                    <option value="price-high">PRICE: HIGH TO LOW</option>
                    <option value="newest">NEWEST</option>
                  </select>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Footer */}
      <div className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-xs tracking-[0.3em] mb-4">COMPLIMENTARY SHIPPING</h3>
            <p className="text-xs text-gray-400">On all orders above $500</p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.3em] mb-4">SEAMLESS RETURNS</h3>
            <p className="text-xs text-gray-400">Within 30 days of purchase</p>
          </div>
          <div>
            <h3 className="text-xs tracking-[0.3em] mb-4">PRIVATE CONSULTATION</h3>
            <p className="text-xs text-gray-400">Book your styling session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;