import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Tag } from 'lucide-react';
import { useCheckout } from '../contexts/CheckoutContext';
import Header from '../components/Header';
import MobileVerification from '../components/checkout/MobileVerification';
import DeliveryDetails from '../components/checkout/DeliveryDetails';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCheckout();

  const [expandedItems, setExpandedItems] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showCouponList, setShowCouponList] = useState(false);
  const [currentStep, setCurrentStep] = useState('mobile'); // mobile, delivery, payment

  // Available coupons
  const availableCoupons = [
    { code: 'WELCOME10', discount: '10%', description: 'Welcome offer - 10% off' },
    { code: 'SAVE20', discount: '20%', description: 'Save 20% on your order' },
    { code: 'FIRST50', discount: '50%', description: 'First purchase special' }
  ];

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    setCouponMessage(result.message);
    if (result.success) {
      setCouponCode('');
    }
    setTimeout(() => setCouponMessage(''), 3000);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
          <h2 
            className="text-4xl md:text-5xl tracking-[0.3em] mb-4"
            style={{ fontFamily: 'Didot, serif' }}
          >
            NO ITEMS TO CHECKOUT
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="mt-8 px-8 py-3 bg-black text-white text-xs tracking-[0.3em] hover:bg-gray-800 transition-colors"
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
      
      <div className="max-w-3xl mx-auto px-6 py-24 mt-16">
        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl tracking-[0.3em] mb-12"
          style={{ fontFamily: 'Didot, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ORDER SUMMARY
        </motion.h1>

        {/* Order Summary Card */}
        <div className="bg-gray-50 p-6 mb-8">
          {/* Header - Always Visible */}
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedItems(!expandedItems)}
          >
            <div>
              <h3 className="text-lg font-medium mb-1">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
              </h3>
              <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              {expandedItems ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Expanded Items List */}
          <AnimatePresence>
            {expandedItems && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-gray-300 space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 bg-gray-200 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                            <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-600">
                              Size: {item.size} | Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id, item.size);
                              }}
                              className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Price Breakdown */}
                  <div className="pt-4 border-t border-gray-300 space-y-2 text-sm">
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
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Coupon Section */}
        <div className="bg-white border border-gray-300 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} />
            <h3 className="font-medium">Have a coupon code?</h3>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded">
              <div>
                <p className="font-medium text-green-700">{appliedCoupon.code}</p>
                <p className="text-sm text-green-600">{appliedCoupon.description}</p>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-2 bg-black text-white text-xs tracking-wider hover:bg-gray-800 transition-colors"
                >
                  APPLY
                </button>
              </div>
              
              {couponMessage && (
                <p className={`text-sm mb-3 ${couponMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}

              <button
                onClick={() => setShowCouponList(!showCouponList)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showCouponList ? 'Hide' : 'View'} available coupons
              </button>

              <AnimatePresence>
                {showCouponList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {availableCoupons.map((coupon) => (
                      <div 
                        key={coupon.code}
                        className="border border-dashed border-gray-300 p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-mono font-bold text-sm">{coupon.code}</p>
                          <p className="text-xs text-gray-600">{coupon.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCouponCode(coupon.code);
                            handleApplyCoupon();
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Checkout Steps */}
        {currentStep === 'mobile' && (
          <MobileVerification onVerified={() => setCurrentStep('delivery')} />
        )}

        {currentStep === 'delivery' && (
          <DeliveryDetails onContinue={() => navigate('/payment')} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
