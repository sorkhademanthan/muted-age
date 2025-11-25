import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building, Wallet, Banknote, ChevronRight } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';

const Payment = () => {
  const navigate = useNavigate();
  const { total, setPaymentMethod, deliveryAddress } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, Paytm & more',
      icon: <Smartphone size={24} />,
      recommended: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex, Rupay',
      icon: <CreditCard size={24} />
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <Building size={24} />
    },
    {
      id: 'wallets',
      name: 'Wallets',
      description: 'Paytm, PhonePe, Amazon Pay',
      icon: <Wallet size={24} />
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: '₹100 COD fee will be added',
      icon: <Banknote size={24} />,
      extraCharge: 100
    }
  ];

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentMethod(methodId);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!deliveryAddress.firstName) {
      alert('Please complete delivery address');
      navigate('/checkout');
      return;
    }

    if (selectedMethod === 'upi') {
      navigate('/payment/upi');
    } else if (selectedMethod === 'cod') {
      // For COD, directly go to confirmation
      navigate('/order-confirmation', { state: { paymentMethod: 'cod' } });
    } else {
      // For other methods, you can add specific payment pages
      alert(`${selectedMethod} payment integration coming soon`);
    }
  };

  const codTotal = selectedMethod === 'cod' ? total + 100 : total;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-3xl mx-auto px-6 py-24 mt-16">
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl tracking-[0.3em] mb-12"
          style={{ fontFamily: 'Didot, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          PAY VIA
        </motion.h1>

        {/* Total Amount */}
        <div className="bg-gray-50 p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Amount to Pay</span>
            <span className="text-3xl font-bold">
              ${selectedMethod === 'cod' ? codTotal.toFixed(2) : total.toFixed(2)}
            </span>
          </div>
          {selectedMethod === 'cod' && (
            <p className="text-sm text-gray-600 mt-2">Includes ₹100 COD charges</p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              onClick={() => handleSelectMethod(method.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-6 border-2 rounded-lg flex items-center justify-between transition-all ${
                selectedMethod === method.id
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-full ${
                  selectedMethod === method.id ? 'bg-black text-white' : 'bg-gray-100'
                }`}>
                  {method.icon}
                </div>

                {/* Details */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{method.name}</h3>
                    {method.recommended && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {method.extraCharge && (
                    <p className="text-sm text-orange-600 mt-1">
                      +₹{method.extraCharge} charges
                    </p>
                  )}
                </div>
              </div>

              {/* Radio Button */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id
                  ? 'border-black'
                  : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 rounded-full bg-black" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          CONTINUE
          <ChevronRight size={16} />
        </button>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
