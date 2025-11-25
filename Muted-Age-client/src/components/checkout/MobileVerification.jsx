import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { useCheckout } from '../../contexts/CheckoutContext';

const MobileVerification = ({ onVerified }) => {
  const { mobileNumber, setMobileNumber, setIsVerified } = useCheckout();
  const [countryCode, setCountryCode] = useState('+91');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setShowOTPModal(true);
    // Simulate OTP send
    console.log('OTP sent to:', countryCode + mobileNumber);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification (accept any 6-digit OTP for demo)
    setIsVerified(true);
    setShowOTPModal(false);
    setIsSubmitting(false);
    onVerified();
  };

  return (
    <>
      {/* Mobile Number Section */}
      <div className="bg-white border border-gray-300 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Phone size={18} />
          <h3 className="font-medium">Enter mobile number</h3>
        </div>

        <div className="flex gap-2 mb-2">
          {/* Country Code Selector */}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="+91">India +91</option>
            <option value="+1">USA +1</option>
            <option value="+44">UK +44</option>
            <option value="+61">Australia +61</option>
          </select>

          {/* Mobile Number Input */}
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile number"
            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />

          {/* Send OTP Button */}
          <button
            onClick={handleSendOTP}
            className="px-6 py-3 bg-black text-white text-xs tracking-wider hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            SEND OTP
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        <p className="text-xs text-gray-500 mt-3">
          We'll send you a one-time password to verify your number
        </p>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowOTPModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 md:w-[450px] bg-white rounded-lg shadow-2xl z-50 p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowOTPModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <h3 className="text-2xl font-light tracking-wider mb-2" style={{ fontFamily: 'Didot, serif' }}>
                Verify OTP
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter the 6-digit code sent to {countryCode} {mobileNumber}
              </p>

              {/* OTP Input */}
              <div className="flex gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl border-2 border-gray-300 focus:border-black focus:outline-none rounded"
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}

              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
              </button>

              {/* Resend OTP */}
              <button className="w-full mt-4 text-sm text-blue-600 hover:underline">
                Didn't receive OTP? Resend
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileVerification;
