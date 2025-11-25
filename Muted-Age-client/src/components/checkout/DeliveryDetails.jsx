import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit2, Truck } from 'lucide-react';
import { useCheckout } from '../../contexts/CheckoutContext';

const DeliveryDetails = ({ onContinue }) => {
  const { deliveryAddress, setDeliveryAddress, shipping } = useCheckout();
  const [isEditing, setIsEditing] = useState(!deliveryAddress.firstName);
  const [emailConfirm, setEmailConfirm] = useState('');
  const [errors, setErrors] = useState({});

  // Check if address is filled
  const hasAddress = deliveryAddress.firstName && deliveryAddress.street;

  const handleInputChange = (field, value) => {
    setDeliveryAddress({ ...deliveryAddress, [field]: value });
    // Clear error for this field
    setErrors({ ...errors, [field]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!deliveryAddress.firstName) newErrors.firstName = 'First name is required';
    if (!deliveryAddress.lastName) newErrors.lastName = 'Last name is required';
    if (!deliveryAddress.street) newErrors.street = 'Street address is required';
    if (!deliveryAddress.city) newErrors.city = 'City is required';
    if (!deliveryAddress.state) newErrors.state = 'State is required';
    if (!deliveryAddress.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!deliveryAddress.phone) newErrors.phone = 'Phone number is required';
    if (!deliveryAddress.email) newErrors.email = 'Email is required';
    if (deliveryAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryAddress.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (deliveryAddress.email && deliveryAddress.email !== emailConfirm) {
      newErrors.emailConfirm = 'Emails do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateForm()) {
      setIsEditing(false);
    }
  };

  const handleContinueToPayment = () => {
    if (!hasAddress) {
      alert('Please add delivery address');
      return;
    }
    if (!deliveryAddress.email || deliveryAddress.email !== emailConfirm) {
      alert('Please confirm your email');
      return;
    }
    onContinue();
  };

  // Calculate estimated delivery date
  const estimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Delivery Address Section */}
      <div className="bg-white border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <h3 className="font-medium">Delivery Address</h3>
          </div>
          {hasAddress && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Edit2 size={14} />
              Edit
            </button>
          )}
        </div>

        {!isEditing && hasAddress ? (
          /* Display saved address */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 p-4 rounded"
          >
            <p className="font-medium mb-1">
              {deliveryAddress.firstName} {deliveryAddress.lastName}
            </p>
            <p className="text-sm text-gray-700">
              {deliveryAddress.street}
              {deliveryAddress.apartment && `, ${deliveryAddress.apartment}`}
            </p>
            <p className="text-sm text-gray-700">
              {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Phone: {deliveryAddress.phone}
            </p>
            <p className="text-sm text-gray-700">
              Email: {deliveryAddress.email}
            </p>
          </motion.div>
        ) : (
          /* Address form */
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={deliveryAddress.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First Name *"
                  className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
                />
                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={deliveryAddress.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last Name *"
                  className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
                />
                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <input
                type="text"
                value={deliveryAddress.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Street Address *"
                className={`w-full px-4 py-3 border ${errors.street ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
              />
              {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
            </div>

            <div>
              <input
                type="text"
                value={deliveryAddress.apartment}
                onChange={(e) => handleInputChange('apartment', e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City *"
                  className={`w-full px-4 py-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
                />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State *"
                  className={`w-full px-4 py-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
                />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="ZIP Code *"
                  className={`w-full px-4 py-3 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
                />
                {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                value={deliveryAddress.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone Number *"
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                value={deliveryAddress.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email *"
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveAddress}
              className="w-full bg-black text-white py-3 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors"
            >
              SAVE ADDRESS
            </button>
          </motion.div>
        )}
      </div>

      {/* Email Confirmation */}
      {hasAddress && (
        <div className="bg-white border border-gray-300 p-6">
          <h3 className="font-medium mb-4">Confirm your email</h3>
          <input
            type="email"
            value={emailConfirm}
            onChange={(e) => setEmailConfirm(e.target.value)}
            placeholder="Re-enter your email"
            className={`w-full px-4 py-3 border ${errors.emailConfirm ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-black text-sm`}
          />
          {errors.emailConfirm && <p className="text-xs text-red-600 mt-1">{errors.emailConfirm}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Order confirmation will be sent to this email
          </p>
        </div>
      )}

      {/* Delivery Estimate */}
      {hasAddress && (
        <div className="bg-green-50 border border-green-200 p-6">
          <div className="flex items-start gap-3">
            <Truck size={20} className="text-green-700 mt-1" />
            <div>
              <p className="font-medium text-green-900">Standard delivery: {estimatedDeliveryDate()}</p>
              <p className="text-sm text-green-700 mt-1">
                {shipping === 0 ? '✓ Free shipping for you' : `Shipping: $${shipping.toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Continue to Payment Button */}
      {hasAddress && (
        <button
          onClick={handleContinueToPayment}
          className="w-full bg-black text-white py-4 text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors"
        >
          CONTINUE TO PAYMENT
        </button>
      )}
    </div>
  );
};

export default DeliveryDetails;
