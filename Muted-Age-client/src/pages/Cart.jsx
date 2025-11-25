import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    shipping, 
    total 
  } = useCheckout();

  // Progress Indicator Component
  const ProgressIndicator = ({ currentStep = 1 }) => {
    const steps = [
      { number: 1, label: 'CART' },
      { number: 2, label: 'DETAILS' },
      { number: 3, label: 'PAYMENT' }
    ];

    return (
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-16">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step */}
            <div className="flex items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  step.number === currentStep
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-300 text-gray-400'
                }`}
              >
                {step.number}
              </div>
              <span 
                className={`hidden sm:inline text-xs tracking-[0.2em] font-light transition-colors ${
                  step.number === currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className="w-8 md:w-16 h-px transition-colors"
                style={{ 
                  backgroundColor: step.number < currentStep ? '#111827' : '#D1D5DB'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFEF9]">
        <Header />
        <div className="max-w-6xl mx-auto px-8 py-32 mt-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 
                className="text-5xl md:text-6xl font-light mb-6 tracking-tight"
                style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
              >
                Your cart is currently empty.
              </h2>
              <p className="text-sm text-gray-600 font-light tracking-wide mb-12">
                Discover pieces crafted for a lifetime of elegance.
              </p>
              <motion.button
                onClick={() => navigate('/newarrivals')}
                whileHover={{ x: 4 }}
                className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gray-900 font-light"
              >
                <span className="relative">
                  SHOP NEW ARRIVALS
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-500" />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
              </motion.button>
            </motion.div>
            
            {/* Aspirational Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 aspect-[21/9] bg-gray-100 overflow-hidden"
              style={{ borderRadius: '4px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=95"
                alt="Shop collection"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 mt-16">
        {/* Title */}
        <motion.h1 
          className="text-5xl md:text-7xl font-light tracking-tight mb-6"
          style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Shopping Cart
        </motion.h1>

        <motion.p
          className="text-sm text-gray-600 font-light tracking-wide mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
        </motion.p>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={1} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-6 pb-6 border-b border-gray-200"
                  style={{ borderWidth: '0.5px' }}
                >
                  {/* Product Image - Larger */}
                  <div 
                    className="w-40 h-52 bg-gray-100 flex-shrink-0 overflow-hidden"
                    style={{ borderRadius: '3px' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs tracking-widest text-gray-500 font-light mb-2">
                          {item.brand || 'MUTED AGE'}
                        </p>
                        <h3 className="text-lg font-light text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-light">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-gray-900 transition-colors h-fit"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2.5 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm w-8 text-center font-light">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2.5 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <motion.p 
                        key={item.quantity}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg font-light text-gray-900"
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping Link */}
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ x: -4 }}
              className="group mt-8 inline-flex items-center gap-3 text-sm tracking-[0.2em] text-gray-600 font-light hover:text-gray-900 transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span className="relative">
                CONTINUE SHOPPING
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-500" />
              </span>
            </motion.button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 sticky top-24 border border-gray-200 shadow-sm"
              style={{ borderRadius: '4px' }}
            >
              <h2 
                className="text-2xl font-light mb-8 tracking-wide"
                style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
              >
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Subtotal</span>
                  <span className="font-light">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Tax (18%)</span>
                  <span className="font-light">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Shipping</span>
                  <span className="font-light">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200" style={{ borderWidth: '0.5px' }}>
                  <div className="flex justify-between text-lg">
                    <span className="font-light">Total</span>
                    <span 
                      className="font-light"
                      style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reassurance Text */}
              <div className="pt-6 mt-6 border-t border-gray-200" style={{ borderWidth: '0.5px' }}>
                <p className="text-xs text-gray-500 font-light text-center leading-relaxed tracking-wide">
                  Secure checkout · Encrypted payments · Hassle-free returns
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3 mt-6">
                {/* Primary - Proceed to Checkout */}
                <motion.button
                  onClick={() => navigate('/checkout')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gray-900 text-white py-4 text-xs tracking-[0.25em] font-light hover:bg-black transition-all duration-300"
                  style={{ borderRadius: '3px' }}
                >
                  PROCEED TO CHECKOUT
                </motion.button>

                {/* Secondary - Pay via UPI */}
                <motion.button
                  onClick={() => navigate('/payment')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-white text-gray-900 border border-gray-300 py-3 text-xs tracking-[0.2em] font-light hover:border-gray-900 transition-all duration-300"
                  style={{ borderRadius: '3px' }}
                >
                  PAY VIA UPI
                </motion.button>

                {/* COD Option */}
                <p className="text-xs text-gray-500 font-light text-center pt-2">
                  Cash on Delivery available (+$100 fee)
                </p>
              </div>

              {/* Free Shipping Note */}
              {shipping > 0 && (
                <p className="text-xs text-gray-400 font-light text-center mt-6">
                  Free shipping on orders over $500
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
