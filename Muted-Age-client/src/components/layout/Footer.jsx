// src/components/layout/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 font-sans border-t border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 md:py-16">
        
        {/* Top section: Newsletter and Navigation Links */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16 pb-12">
          
          {/* Newsletter Section */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center mb-4">
                <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-600 text-xs">©</span>
                </div>
                <h3 className="ml-3 text-sm uppercase tracking-widest text-gray-500 font-semibold">Subscribe to our newsletter</h3>
            </div>
            <form action="#" method="POST" className="flex items-center border-b border-gray-700 focus-within:border-gray-400 transition-colors duration-300 py-2">
              <input 
                type="email" 
                name="email" 
                id="email"
                placeholder="Your email"
                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder-gray-500 text-sm"
                required
              />
              <button type="submit" className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1F1F1F] hover:bg-[#2a2a2a] text-white transition-colors duration-300 ease-in-out rounded-sm">
                Join
              </button>
            </form>
          </div>

          {/* Link Sections Wrapper */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full lg:w-auto">
            {/* Customer Care Links */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">(Customer Care)</h3>
              <ul className="space-y-3">
                <li><Link to="/account" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Account</Link></li>
                <li><Link to="/track-orders" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Track Orders</Link></li>
                <li><Link to="/store" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Our Store</Link></li>
                <li><Link to="/faq" className="text-base text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
              </ul>
            </div>

            {/* Navigate Links */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">(Navigate)</h3>
              <ul className="space-y-3">
                <li><Link to="/shop" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Shop</Link></li>
                <li><Link to="/brand" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Brand</Link></li>
                <li><Link to="/journal" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Journal</Link></li>
                <li><Link to="/contact" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>

            {/* Other Links */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">(Other)</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-base text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
                <li><Link to="/404" className="text-base text-gray-300 hover:text-white transition-colors duration-300">404</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section: Brand Name and Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <h2
            className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-black text-white leading-none -ml-1 md:-ml-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Muted Age
          </h2>
          <p className="text-sm text-gray-500 md:pb-6 whitespace-nowrap">
            Manthan Sorkhade ©2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;