import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, MessageCircle } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { cartItemCount } = useCheckout();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 
            className="text-2xl md:text-3xl tracking-[0.3em] font-light"
            style={{ fontFamily: 'Didot, serif' }}
          >
            MUTED AGE
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/shop" 
            className="text-xs tracking-[0.3em] hover:text-gray-600 transition-colors"
          >
            SHOP
          </Link>
          <Link 
            to="/newarrivals" 
            className="text-xs tracking-[0.3em] hover:text-gray-600 transition-colors"
          >
            NEW ARRIVALS
          </Link>
          <Link 
            to="/orders" 
            className="text-xs tracking-[0.3em] hover:text-gray-600 transition-colors"
          >
            ORDERS
          </Link>
          <Link 
            to="/support" 
            className="text-xs tracking-[0.3em] hover:text-gray-600 transition-colors"
          >
            SUPPORT
          </Link>
          <Link 
            to="/brand" 
            className="text-xs tracking-[0.3em] hover:text-gray-600 transition-colors"
          >
            BRAND
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Support Icon */}
          <button
            onClick={() => navigate('/support')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Support"
          >
            <MessageCircle size={20} />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigate('/wishlist')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart size={20} />
          </button>

          {/* Profile Icon */}
          <button
            onClick={() => navigate('/profile')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Profile"
          >
            <User size={20} />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Cart"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {cartItemCount}
              </motion.div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
