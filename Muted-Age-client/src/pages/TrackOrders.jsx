import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, Truck, Home, Check } from 'lucide-react';

const TrackOrders = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock tracking data
  const mockOrders = {
    'MA-2024-001': {
      id: 'MA-2024-001',
      item: 'Silk Evening Dress',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90',
      currentStatus: 'in-transit',
      origin: 'Atelier Paris',
      destination: 'New York, NY',
      estimatedDelivery: 'Tomorrow, 3:00 PM',
      timeline: [
        { stage: 'ordered', label: 'Order Confirmed', date: '2024.12.08', time: '14:30', completed: true },
        { stage: 'preparing', label: 'Preparing for Transit', date: '2024.12.09', time: '09:15', completed: true },
        { stage: 'dispatched', label: 'Dispatched from Atelier', date: '2024.12.10', time: '11:00', completed: true },
        { stage: 'in-transit', label: 'En Route', date: '2024.12.11', time: '18:45', completed: true, active: true },
        { stage: 'out-for-delivery', label: 'Out for Delivery', date: '2024.12.12', time: 'Est. 10:00', completed: false },
        { stage: 'delivered', label: 'Artifact Acquired', date: '2024.12.12', time: 'Est. 15:00', completed: false },
      ],
    },
    'MA-2024-002': {
      id: 'MA-2024-002',
      item: 'Cashmere Overcoat',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=90',
      currentStatus: 'delivered',
      origin: 'Atelier Milan',
      destination: 'Brooklyn, NY',
      estimatedDelivery: 'Delivered on 2024.12.01',
      timeline: [
        { stage: 'ordered', label: 'Order Confirmed', date: '2024.11.25', time: '16:20', completed: true },
        { stage: 'preparing', label: 'Preparing for Transit', date: '2024.11.26', time: '10:00', completed: true },
        { stage: 'dispatched', label: 'Dispatched from Atelier', date: '2024.11.27', time: '08:30', completed: true },
        { stage: 'in-transit', label: 'En Route', date: '2024.11.29', time: '14:00', completed: true },
        { stage: 'out-for-delivery', label: 'Out for Delivery', date: '2024.12.01', time: '09:15', completed: true },
        { stage: 'delivered', label: 'Artifact Acquired', date: '2024.12.01', time: '14:32', completed: true, active: true },
      ],
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      const data = mockOrders[orderNumber.toUpperCase()];
      setTrackingData(data || null);
      setIsSearching(false);
    }, 800);
  };

  const handleReset = () => {
    setOrderNumber('');
    setTrackingData(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {!trackingData ? (
            // State 1: The Inquiry
            <motion.div
              key="inquiry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <h1 className="text-5xl md:text-7xl font-serif text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Locate Your Order
              </h1>
              <p className="text-sm text-neutral-400 font-mono mb-16 text-center">
                SATELLITE PRECISION TRACKING
              </p>

              <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="MA-2024-XXX"
                    className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-none px-8 py-6 text-center text-lg font-mono tracking-wider focus:outline-none focus:border-neutral-900 transition-all duration-300"
                    disabled={isSearching}
                  />
                  <motion.button
                    type="submit"
                    disabled={!orderNumber || isSearching}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full bg-neutral-900 text-white py-4 rounded-none font-medium tracking-wider hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        LOCATING...
                      </span>
                    ) : (
                      'LOCATE →'
                    )}
                  </motion.button>
                </div>
              </form>

              <p className="text-xs text-neutral-400 mt-12 text-center">
                Try: MA-2024-001 or MA-2024-002
              </p>
            </motion.div>
          ) : (
            // State 2: The Revelation
            <motion.div
              key="revelation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-16">
                <button
                  onClick={handleReset}
                  className="text-sm text-neutral-500 hover:text-black transition-colors mb-8 font-mono"
                >
                  ← NEW SEARCH
                </button>
                <div className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-xs font-mono text-neutral-400 mb-2">ORDER NUMBER</p>
                    <h2 className="text-3xl font-mono mb-6">{trackingData.id}</h2>
                    <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {trackingData.item}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {trackingData.origin} → {trackingData.destination}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product & Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="aspect-[3/4] bg-neutral-50"
                >
                  <img
                    src={trackingData.image}
                    alt={trackingData.item}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                  <p className="text-xs font-mono text-neutral-400 mb-8">JOURNEY STATUS</p>
                  
                  {/* The Timeline Line */}
                  <motion.div
                    className="absolute left-[7px] top-12 w-[2px] bg-neutral-200"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />

                  <div className="space-y-8 relative">
                    {trackingData.timeline.map((checkpoint, index) => (
                      <motion.div
                        key={checkpoint.stage}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                        className="flex items-start gap-6 relative"
                      >
                        {/* Dot */}
                        <div className="relative flex items-center justify-center">
                          {checkpoint.active ? (
                            <motion.div
                              className="w-4 h-4 bg-black rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-black rounded-full"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          ) : checkpoint.completed ? (
                            <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-neutral-300 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                          <h3 className={`text-base font-medium mb-1 ${
                            checkpoint.completed ? 'text-black' : 'text-neutral-400'
                          }`}>
                            {checkpoint.label}
                          </h3>
                          <p className={`text-xs font-mono ${
                            checkpoint.completed ? 'text-neutral-500' : 'text-neutral-400'
                          }`}>
                            {checkpoint.date} · {checkpoint.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Estimate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-neutral-50 border border-neutral-200 p-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-neutral-400 mb-2">ESTIMATED ARRIVAL</p>
                    <p className="text-xl font-medium">{trackingData.estimatedDelivery}</p>
                  </div>
                  <Home className="w-8 h-8 text-neutral-400" />
                </div>
              </motion.div>

              {/* Abstract Distance Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 pt-12 border-t border-neutral-200"
              >
                <p className="text-xs font-mono text-neutral-400 mb-4">TRANSIT VISUALIZATION</p>
                <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-black"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: trackingData.currentStatus === 'delivered' ? '100%' : 
                             trackingData.currentStatus === 'in-transit' ? '60%' : '30%'
                    }}
                    transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs font-mono text-neutral-400">
                  <span>{trackingData.origin}</span>
                  <span>{trackingData.destination}</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
      `}</style>
    </div>
  );
};

export default TrackOrders;
