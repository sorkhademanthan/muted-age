import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
          <ShoppingBag size={64} className="text-gray-300 mb-6" />
          <h2 
            className="text-4xl md:text-5xl tracking-[0.3em] mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            YOUR CART IS EMPTY
          </h2>
          <p className="text-sm tracking-wider text-gray-500 mb-8">
            Discover our latest collection
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-black text-white text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-24 mt-16">
        {/* Title */}
        <motion.h1 
          className="text-5xl md:text-7xl tracking-[0.3em] mb-12"
          style={{ fontFamily: 'Didot, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SHOPPING CART
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-6 pb-6 border-b border-gray-200"
                >
                  {/* Product Image */}
                  <div className="w-32 h-40 bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-xs tracking-widest text-gray-500 mb-1">
                          {item.brand}
                        </p>
                        <h3 className="text-lg font-serif mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="p-2 hover:bg-gray-100 rounded-full h-fit transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-lg font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-24">
              <h2 
                className="text-2xl tracking-wider mb-6"
                style={{ fontFamily: 'Didot, serif' }}
              >
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-500 mb-6 text-center">
                  Free shipping on orders over $500
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors mb-4"
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-white text-black border border-black py-4 text-xs tracking-[0.3em] hover:bg-gray-100 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
