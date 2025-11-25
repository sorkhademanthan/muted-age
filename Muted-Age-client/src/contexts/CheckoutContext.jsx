import React, { createContext, useContext, useState, useEffect } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mutedage_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, summary, mobile, delivery, payment, confirmation
  const [selectedSize, setSelectedSize] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('mutedage_cart', JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product, size) => {
    const existingItem = cart.find(
      item => item.id === product.id && item.size === size
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, size, quantity: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (productId, size) => {
    setCart(cart.filter(item => !(item.id === productId && item.size === size)));
  };

  // Update quantity
  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    ));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Buy now (add to cart and go to checkout)
  const buyNow = (product, size) => {
    clearCart();
    addToCart(product, size);
    setCheckoutStep('summary');
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const shipping = subtotal > 500 ? 0 : 9.99;
  const discount = appliedCoupon ? (subtotal * (appliedCoupon.percentage / 100)) : 0;
  const total = subtotal + tax + shipping - discount;

  // Get cart item count
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Apply coupon
  const applyCoupon = (code) => {
    // Mock coupon logic
    const coupons = {
      'WELCOME10': { code: 'WELCOME10', percentage: 10, description: '10% off your order' },
      'SAVE20': { code: 'SAVE20', percentage: 20, description: '20% off your order' },
      'FIRST50': { code: 'FIRST50', percentage: 50, description: '50% off first purchase' }
    };

    if (coupons[code.toUpperCase()]) {
      setAppliedCoupon(coupons[code.toUpperCase()]);
      return { success: true, message: 'Coupon applied successfully!' };
    }
    return { success: false, message: 'Invalid coupon code' };
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const value = {
    // Cart
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    buyNow,
    cartItemCount,

    // Checkout
    checkoutStep,
    setCheckoutStep,
    selectedSize,
    setSelectedSize,

    // Mobile verification
    mobileNumber,
    setMobileNumber,
    isVerified,
    setIsVerified,

    // Delivery
    deliveryAddress,
    setDeliveryAddress,

    // Payment
    paymentMethod,
    setPaymentMethod,

    // Coupons
    appliedCoupon,
    applyCoupon,
    removeCoupon,

    // Totals
    subtotal,
    tax,
    shipping,
    discount,
    total,

    // Order
    orderDetails,
    setOrderDetails
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};
