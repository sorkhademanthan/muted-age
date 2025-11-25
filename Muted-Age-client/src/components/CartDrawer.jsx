import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    cartItemCount
  } = useCheckout();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-[#FFFEF9] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200" style={{ borderWidth: '0.5px' }}>
              <div>
                <h2 
                  className="text-2xl font-light tracking-wide mb-1"
                  style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
                >
                  Shopping Cart
                </h2>
                <p className="text-xs text-gray-500 font-light tracking-wide">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <p className="text-sm text-gray-500 font-light tracking-wide">
                    Your cart is currently empty
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex-1 pr-2">
                          <h3 className="text-sm font-light text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-light mt-1">
                            Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-xs text-gray-400 hover:text-gray-900 font-light transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs w-6 text-center font-light">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-light text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-8 space-y-6" style={{ borderWidth: '0.5px' }}>
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-base font-light text-gray-600">Subtotal</span>
                  <span 
                    className="text-2xl font-light text-gray-900"
                    style={{ fontFamily: 'Bodoni Moda, Playfair Display, serif' }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Tax & Shipping Note */}
                <p className="text-xs text-gray-500 font-light text-center leading-relaxed">
                  Tax & shipping calculated at checkout
                </p>

                {/* CTAs */}
                <div className="space-y-3">
                  {/* Primary - Secure Checkout */}
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gray-900 text-white py-4 text-xs tracking-[0.25em] font-light hover:bg-black transition-all duration-300"
                    style={{ borderRadius: '3px' }}
                  >
                    SECURE CHECKOUT
                  </motion.button>

                  {/* Secondary - Continue Shopping */}
                  <button
                    onClick={handleContinueShopping}
                    className="group w-full text-center text-xs tracking-[0.2em] text-gray-600 font-light hover:text-gray-900 transition-colors"
                  >
                    <span className="relative inline-block">
                      CONTINUE SHOPPING
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
