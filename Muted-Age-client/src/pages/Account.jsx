import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, MapPin, Settings, CreditCard } from 'lucide-react';

const Account = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const mockUser = {
    name: 'Alexandra Chen',
    email: 'alexandra.chen@example.com',
    memberSince: 'January 2023',
    activeOrder: {
      id: '#8829',
      status: 'Being prepared in our atelier',
      item: 'Silk Evening Dress',
      estimatedDelivery: 'December 18, 2024'
    },
    orders: [
      {
        id: '#8829',
        date: 'December 10, 2024',
        item: 'Silk Evening Dress',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90',
        price: '$1,299',
        status: 'In Progress'
      },
      {
        id: '#8756',
        date: 'November 22, 2024',
        item: 'Cashmere Overcoat',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90',
        price: '$899',
        status: 'Delivered'
      },
      {
        id: '#8621',
        date: 'October 15, 2024',
        item: 'Wool Trousers',
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=90',
        price: '$549',
        status: 'Delivered'
      },
      {
        id: '#8492',
        date: 'September 8, 2024',
        item: 'Leather Boots',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=90',
        price: '$799',
        status: 'Delivered'
      },
      {
        id: '#8301',
        date: 'August 12, 2024',
        item: 'Linen Shirt',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=90',
        price: '$329',
        status: 'Delivered'
      },
      {
        id: '#8124',
        date: 'July 5, 2024',
        item: 'Minimalist Bag',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=90',
        price: '$899',
        status: 'Delivered'
      }
    ],
    shipping: {
      address: '123 Minimal Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    payment: {
      last4: '4242',
      expiry: '12/26',
      type: 'Visa'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'wardrobe', label: 'My Wardrobe', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Horizontal Scroll Navigation */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-6 py-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 text-sm whitespace-nowrap pb-1 transition-all ${
                  activeTab === tab.id
                    ? 'font-semibold border-b-2 border-black'
                    : 'text-neutral-500 border-b-2 border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Split Layout */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex min-h-screen">
          {/* Left Sidebar - 20% */}
          <aside className="hidden lg:block w-[20%] border-r border-neutral-200 p-12">
            <div className="sticky top-12">
              <h1 className="text-2xl font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {mockUser.name}
              </h1>
              <p className="text-sm text-neutral-500 mb-12">{mockUser.email}</p>

              <nav className="space-y-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 text-sm transition-all group ${
                      activeTab === tab.id ? 'font-semibold' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className={`border-b ${activeTab === tab.id ? 'border-black' : 'border-transparent group-hover:border-neutral-300'}`}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-16 pt-6 border-t border-neutral-200">
                <p className="text-xs text-neutral-400">MEMBER SINCE</p>
                <p className="text-sm font-medium mt-1">{mockUser.memberSince}</p>
              </div>
            </div>
          </aside>

          {/* Right Content - 80% */}
          <main className="w-full lg:w-[80%] p-6 lg:p-16">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-serif mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Welcome back, {mockUser.name.split(' ')[0]}.
                  </h2>

                  {/* Active Order Status */}
                  {mockUser.activeOrder && (
                    <div className="bg-neutral-50 border border-neutral-200 p-8 mb-12">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-neutral-500 mb-2">CURRENT ORDER</p>
                          <p className="text-xl font-medium mb-2">Order {mockUser.activeOrder.id}</p>
                          <p className="text-sm text-neutral-600 mb-1">{mockUser.activeOrder.status}</p>
                          <p className="text-sm text-neutral-500">{mockUser.activeOrder.item}</p>
                          <p className="text-xs text-neutral-400 mt-3">Est. Delivery: {mockUser.activeOrder.estimatedDelivery}</p>
                        </div>
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors">
                          Track
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Personal Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <p className="text-xs text-neutral-500 mb-4">SHIPPING ADDRESS</p>
                      <div className="text-sm leading-relaxed text-neutral-700">
                        <p>{mockUser.shipping.address}</p>
                        <p>{mockUser.shipping.city}, {mockUser.shipping.state} {mockUser.shipping.zip}</p>
                        <p>{mockUser.shipping.country}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-neutral-500 mb-4">PAYMENT METHOD</p>
                      <div className="text-sm leading-relaxed text-neutral-700">
                        <p>{mockUser.payment.type} •••• {mockUser.payment.last4}</p>
                        <p className="text-neutral-500">Expires {mockUser.payment.expiry}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* My Wardrobe Tab */}
              {activeTab === 'wardrobe' && (
                <motion.div
                  key="wardrobe"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-serif mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    My Wardrobe
                  </h2>
                  <p className="text-neutral-500 mb-12">{mockUser.orders.length} pieces acquired</p>

                  {/* Visual Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockUser.orders.map((order) => (
                      <div key={order.id} className="group">
                        <div className="aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
                          <img
                            src={order.image}
                            alt={order.item}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-neutral-400">{order.id}</p>
                          <h3 className="font-medium">{order.item}</h3>
                          <p className="text-sm text-neutral-500">{order.date}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-mono">{order.price}</span>
                            <button className="text-xs border-b border-black hover:border-neutral-400 transition-colors">
                              Buy Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-serif mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Addresses
                  </h2>

                  <div className="max-w-2xl">
                    <div className="border-b border-neutral-200 pb-8 mb-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-xs text-neutral-500 mb-3">PRIMARY ADDRESS</p>
                          <div className="text-sm leading-relaxed text-neutral-700">
                            <p>{mockUser.shipping.address}</p>
                            <p>{mockUser.shipping.city}, {mockUser.shipping.state} {mockUser.shipping.zip}</p>
                            <p>{mockUser.shipping.country}</p>
                          </div>
                        </div>
                        <button className="text-xs border-b border-neutral-300 hover:border-black transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>

                    <button className="text-sm font-medium border-b border-black hover:border-neutral-400 transition-colors">
                      + Add New Address
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-serif mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Payment Methods
                  </h2>

                  <div className="max-w-2xl">
                    <div className="border-b border-neutral-200 pb-8 mb-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-xs text-neutral-500 mb-3">PRIMARY CARD</p>
                          <div className="text-sm leading-relaxed text-neutral-700">
                            <p className="font-medium">{mockUser.payment.type} ending in {mockUser.payment.last4}</p>
                            <p className="text-neutral-500 mt-1">Expires {mockUser.payment.expiry}</p>
                          </div>
                        </div>
                        <button className="text-xs border-b border-neutral-300 hover:border-black transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>

                    <button className="text-sm font-medium border-b border-black hover:border-neutral-400 transition-colors">
                      + Add New Card
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-serif mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Settings
                  </h2>

                  <div className="max-w-2xl space-y-8">
                    {/* Line Inputs */}
                    <div>
                      <label className="block text-xs text-neutral-500 mb-3">FULL NAME</label>
                      <input
                        type="text"
                        defaultValue={mockUser.name}
                        className="w-full border-b border-neutral-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-3">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        defaultValue={mockUser.email}
                        className="w-full border-b border-neutral-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-3">PASSWORD</label>
                      <input
                        type="password"
                        placeholder="••••••••••"
                        className="w-full border-b border-neutral-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>

                    <div className="pt-8">
                      <button className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Account;
