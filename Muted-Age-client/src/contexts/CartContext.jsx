import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await cartService.getCart();
        setCart(response.data);
        console.log('✅ Cart loaded:', response.data);
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data);
      console.log('✅ Cart refreshed');
      return response.data;
    } catch (error) {
      console.error('❌ Error refreshing cart:', error);
      setCart(null);
      throw error;
    }
  };

  const addToCart = async (itemData) => {
    try {
      await cartService.addToCart(itemData);
      await refreshCart();
      console.log('✅ Item added to cart');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, { quantity });
      await refreshCart();
      console.log('✅ Cart item updated');
    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await refreshCart();
      console.log('✅ Item removed from cart');
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      throw error;
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      await cartService.applyCoupon(couponCode);
      await refreshCart();
      console.log('✅ Coupon applied');
    } catch (error) {
      console.error('❌ Error applying coupon:', error);
      throw error;
    }
  };

  const removeCoupon = async () => {
    try {
      await cartService.removeCoupon();
      await refreshCart();
      console.log('✅ Coupon removed');
    } catch (error) {
      console.error('❌ Error removing coupon:', error);
      throw error;
    }
  };

  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    refreshCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    cartCount: getCartCount(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;
