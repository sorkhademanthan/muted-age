import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, CreditCard, Mail, Smartphone, ArrowRight } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    total, 
    deliveryAddress, 
    clearCart,
    mobileNumber 
  } = useCheckout();
  
  const [orderNumber, setOrderNumber] = useState('');
  const paymentMethodFromState = location.state?.paymentMethod || 'unknown';

  // Generate mock order number
  useEffect(() => {
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `MA-${year}-${random}`;
    };
    
    setOrderNumber(generateOrderNumber());

    // Clear cart after order (optional - can be done after payment confirmation)
    // clearCart();
  }, []);

  // Calculate estimated delivery
  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethodFromState) {
      case 'upi':
      case 'upi-qr':
        return 'UPI Payment';
      case 'cod':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      case 'netbanking':
        return 'Net Banking';
      case 'wallets':
        return 'Wallet';
      default:
        return 'Online Payment';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-24 mt-16">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 15,
                delay: 0.4 
              }}
            >
              <CheckCircle size={80} className="text-green-500" strokeWidth={2} />
            </motion.div>
            {/* Ripple effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-5xl md:text-6xl tracking-[0.3em] mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            ORDER PLACED
          </h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your purchase!</p>
          <p className="text-sm text-gray-500">
            Order confirmation has been sent to your email
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-8 mb-8"
        >
          {/* Order Number */}
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Order Number</p>
            <p className="text-3xl font-bold tracking-wider">{orderNumber}</p>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <Package size={18} />
                <span>ORDER SUMMARY</span>
              </div>
              <div className="bg-white rounded p-4 space-y-2">
                {cart.slice(0, 2).map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} (Size: {item.size}) x{item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {cart.length > 2 && (
                  <p className="text-xs text-gray-500">+ {cart.length - 2} more items</p>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <MapPin size={18} />
                <span>DELIVERY ADDRESS</span>
              </div>
              <div className="bg-white rounded p-4 text-sm text-gray-700">
                <p className="font-medium mb-1">
                  {deliveryAddress.firstName} {deliveryAddress.lastName}
                </p>
                <p>{deliveryAddress.street}</p>
                {deliveryAddress.apartment && <p>{deliveryAddress.apartment}</p>}
                <p>
                  {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Smartphone size={14} />
                  {deliveryAddress.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  {deliveryAddress.email}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <CreditCard size={18} />
                <span>PAYMENT METHOD</span>
              </div>
              <div className="bg-white rounded p-4">
                <p className="text-sm font-medium">{getPaymentMethodLabel()}</p>
                <p className="text-xs text-green-600 mt-1">
                  {paymentMethodFromState === 'cod' ? 'Pay on delivery' : 'Payment successful'}
                </p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <Package size={18} />
                <span>ESTIMATED DELIVERY</span>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded p-4">
                <p className="text-lg font-semibold text-green-900">
                  {getEstimatedDelivery()}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Standard delivery (3-5 business days)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Mail size={18} className="text-blue-600" />
            Order Confirmation Sent
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            We've sent order confirmation and tracking details to:
          </p>
          <p className="font-medium text-blue-900">{deliveryAddress.email}</p>
          <p className="font-medium text-blue-900">+{mobileNumber}</p>
          <p className="text-xs text-gray-600 mt-3">
            You'll receive updates about your order status via email and SMS
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/track-orders')}
            className="flex-1 bg-black text-white py-4 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            TRACK YOUR ORDER
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 bg-white text-black border-2 border-black py-4 text-xs tracking-[0.3em] hover:bg-gray-50 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-12 pt-12 border-t border-gray-200"
        >
          <p 
            className="text-3xl tracking-[0.3em] mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            THANK YOU
          </p>
          <p className="text-sm text-gray-600">
            for choosing MUTED AGE
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
