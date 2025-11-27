# Feature 4: Checkout & Orders Integration

**Goal:** Complete checkout flow and order management

**Time:** 6 hours  
**Priority:** Critical  
**Dependencies:** Authentication ✅, Products ✅, Cart ✅

---

## 📋 Overview

### What We'll Build:
1. **Checkout Page** - Address form, order review, place order
2. **Order Confirmation Page** - Show order details after purchase
3. **Orders History Page** - List all user orders
4. **Order Details Page** - View single order with tracking
5. **Track Order Page** - Order timeline/tracking

### Backend Endpoints We'll Use:
```javascript
POST   /api/orders                    // Create order from cart
GET    /api/orders                    // Get user's orders
GET    /api/orders/:id                // Get order details
GET    /api/orders/:id/tracking       // Track order timeline
```

---

## 🛒 TASK 4.1: Create Checkout Page (2 hours)

### File: `src/pages/Checkout.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService, userService, cartService } from '../services';

function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useExistingAddress, setUseExistingAddress] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveAddress, setSaveAddress] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    loadSavedAddresses();
    validateCartBeforeCheckout();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const response = await userService.getAddresses();
      setSavedAddresses(response.data);
      
      // Auto-fill with default address if exists
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setShippingAddress({
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          street: defaultAddress.street,
          apartment: defaultAddress.apartment || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
          phone: defaultAddress.phone,
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const validateCartBeforeCheckout = async () => {
    setValidating(true);
    try {
      await cartService.validateCart();
    } catch (error) {
      setError('Some items in your cart are no longer available. Please review your cart.');
    } finally {
      setValidating(false);
    }
  };

  const handleUseExistingAddress = (address) => {
    setShippingAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
    });
    setUseExistingAddress(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        shippingAddress: {
          ...shippingAddress,
          type: 'shipping',
        },
        billingAddress: sameAsShipping ? {
          ...shippingAddress,
          type: 'billing',
        } : {
          ...billingAddress,
          type: 'billing',
        },
        paymentMethod: 'COD', // Cash on Delivery for now
        orderNotes: orderNotes,
      };

      // Save address if checkbox checked
      if (saveAddress) {
        try {
          await userService.addAddress({
            ...shippingAddress,
            type: 'shipping',
          });
        } catch (err) {
          console.error('Failed to save address:', err);
        }
      }

      // Create order
      const response = await orderService.createOrder(orderData);
      
      console.log('✅ Order created:', response.data);

      // Refresh cart (should be empty now)
      await refreshCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${response.data._id}`);

    } catch (err) {
      console.error('❌ Order creation failed:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  if (validating) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Validating cart...</div>;
  }

  return (
    <div className="checkout-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Checkout</h1>

      {error && (
        <div style={{ background: '#fee', border: '1px solid red', padding: '15px', marginTop: '20px', color: 'red' }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '30px' }}>
          
          {/* Left Column - Address Form */}
          <div>
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <button
                  type="button"
                  onClick={() => setUseExistingAddress(!useExistingAddress)}
                  style={{ padding: '10px 20px', marginBottom: '15px' }}
                >
                  {useExistingAddress ? 'Enter New Address' : 'Use Saved Address'}
                </button>

                {useExistingAddress && (
                  <div style={{ border: '1px solid #ddd', padding: '15px' }}>
                    <h3>Select Address:</h3>
                    {savedAddresses.map(addr => (
                      <div 
                        key={addr._id}
                        onClick={() => handleUseExistingAddress(addr)}
                        style={{ 
                          padding: '15px', 
                          border: '1px solid #ddd', 
                          marginBottom: '10px',
                          cursor: 'pointer',
                          background: '#f9f9f9'
                        }}
                      >
                        <p><strong>{addr.firstName} {addr.lastName}</strong></p>
                        <p>{addr.street} {addr.apartment}</p>
                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p>{addr.phone}</p>
                        {addr.isDefault && <span style={{ color: 'green' }}>✓ Default</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Shipping Address Form */}
            {!useExistingAddress && (
              <>
                <h2>Shipping Address</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                  <div>
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label>Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                  />
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label>Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div>
                    <label>City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                  />
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    {' '}Save this address for future orders
                  </label>
                </div>

                {/* Billing Address */}
                <div style={{ marginTop: '30px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    />
                    {' '}Billing address same as shipping
                  </label>
                </div>

                {!sameAsShipping && (
                  <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd' }}>
                    <h3>Billing Address</h3>
                    {/* Repeat similar fields for billing address */}
                    <p style={{ color: '#666' }}>Billing address form (similar to shipping)</p>
                  </div>
                )}
              </>
            )}

            {/* Order Notes */}
            <div style={{ marginTop: '30px' }}>
              <label>Order Notes (optional)</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows="4"
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ border: '1px solid #ddd', padding: '20px', position: 'sticky', top: '20px' }}>
              <h2>Order Summary</h2>

              {/* Order Items */}
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px' }}>
                {cart.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                    <img 
                      src={item.product.images[0]?.url} 
                      alt={item.product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.product.name}</p>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        Size: {item.variant.size} × {item.quantity}
                      </p>
                      <p>${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Shipping:</span>
                  <span>${cart.shipping.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Tax:</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                {cart.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'green' }}>
                    <span>Discount:</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                  <span>Total:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Payment Method:</p>
                <p>💵 Cash on Delivery (COD)</p>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  Pay when you receive your order
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? '#ccc' : '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
                By placing your order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
```

---

## ✅ TASK 4.2: Create Order Confirmation Page (1 hour)

### File: `src/pages/OrderConfirmation.jsx`

```javascript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services';

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      console.log('✅ Order loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading order...</div>;
  }

  if (!order) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Order not found</div>;
  }

  return (
    <div className="order-confirmation" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Success Message */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '60px', color: 'green' }}>✓</div>
        <h1 style={{ marginTop: '20px' }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
          Thank you for your order. We've received your order and will process it shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <div style={{ border: '1px solid #ddd', padding: '30px', background: '#f9f9f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>Order Number</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{order.orderNumber}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>Order Date</p>
            <p style={{ fontSize: '16px' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>Total Amount</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'green' }}>${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>Payment Method</p>
            <p style={{ fontSize: '16px' }}>💵 {order.paymentMethod}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Shipping Address:</h3>
          <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p>{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>

        {/* Order Items */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Order Items ({order.items.length}):</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', padding: '15px', background: 'white' }}>
              <img 
                src={item.productSnapshot.image} 
                alt={item.productSnapshot.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{item.productSnapshot.name}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Size: {item.variant.size} × {item.quantity}
                </p>
                <p style={{ fontSize: '16px', marginTop: '5px' }}>${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
        <Link 
          to={`/orders/${order._id}`}
          style={{
            padding: '12px 30px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          View Order Details
        </Link>
        <Link 
          to="/shop"
          style={{
            padding: '12px 30px',
            background: '#fff',
            color: '#000',
            textDecoration: 'none',
            border: '1px solid #000',
            borderRadius: '5px',
          }}
        >
          Continue Shopping
        </Link>
      </div>

      {/* Email Confirmation Notice */}
      <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
        📧 A confirmation email will be sent to <strong>{order.user.email}</strong>
      </p>
    </div>
  );
}

export default OrderConfirmation;
```

---

## 📋 TASK 4.3: Create Orders History Page (1 hour)

### File: `src/pages/Orders.jsx`

```javascript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders();
      setOrders(response.data);
      console.log('✅ Orders loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: '#2196F3',
      processing: '#FF9800',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Orders Yet</h2>
        <p style={{ marginTop: '20px', color: '#666' }}>
          You haven't placed any orders yet.
        </p>
        <Link 
          to="/shop"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 30px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Orders ({orders.length})</h1>

      <div style={{ marginTop: '30px' }}>
        {orders.map(order => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div 
              style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                marginBottom: '20px',
                borderRadius: '8px',
                transition: 'box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Order {order.orderNumber}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span 
                    style={{ 
                      padding: '6px 12px', 
                      background: getStatusColor(order.orderStatus),
                      color: 'white',
                      borderRadius: '5px',
                      fontSize: '14px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.orderStatus}
                  </span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                {order.items.slice(0, 3).map(item => (
                  <img 
                    key={item._id}
                    src={item.productSnapshot.image} 
                    alt={item.productSnapshot.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                ))}
                {order.items.length > 3 && (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}>
                    +{order.items.length - 3}
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <p style={{ color: '#666' }}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#2196F3', fontWeight: 'bold' }}>View Details →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Orders;
```

---

## 📦 TASK 4.4: Create Order Details Page (1 hour)

### File: `src/pages/OrderDetail.jsx`

```javascript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services';

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      console.log('✅ Order loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: '#2196F3',
      processing: '#FF9800',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading order...</div>;
  }

  if (!order) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Order not found</div>;
  }

  return (
    <div className="order-detail" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/orders" style={{ color: '#2196F3', textDecoration: 'none' }}>
          ← Back to Orders
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div>
            <h1>Order {order.orderNumber}</h1>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <span 
            style={{ 
              padding: '10px 20px', 
              background: getStatusColor(order.orderStatus),
              color: 'white',
              borderRadius: '5px',
              fontSize: '16px',
              textTransform: 'capitalize',
              fontWeight: 'bold',
            }}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Left Column */}
        <div>
          {/* Order Timeline */}
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Timeline</h2>
            {order.timeline && order.timeline.length > 0 ? (
              <div>
                {order.timeline.map((event, index) => (
                  <div key={index} style={{ position: 'relative', paddingLeft: '30px', paddingBottom: '20px' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: getStatusColor(event.status),
                    }} />
                    {/* Timeline line */}
                    {index < order.timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '7px',
                        top: '16px',
                        width: '2px',
                        height: '100%',
                        background: '#ddd',
                      }} />
                    )}
                    <p style={{ fontWeight: 'bold', textTransform: 'capitalize', marginBottom: '5px' }}>
                      {event.status}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.note && (
                      <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                        {event.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No timeline available</p>
            )}
          </div>

          {/* Order Items */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Items ({order.items.length})</h2>
            {order.items.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '15px', padding: '15px', background: '#f9f9f9', marginBottom: '15px', borderRadius: '8px' }}>
                <img 
                  src={item.productSnapshot.image} 
                  alt={item.productSnapshot.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                />
                <div style={{ flex: 1 }}>
                  <Link 
                    to={`/products/${item.productSnapshot.slug}`}
                    style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    {item.productSnapshot.name}
                  </Link>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    {item.productSnapshot.brand}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Size: {item.variant.size} {item.variant.color && `| Color: ${item.variant.color}`}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Quantity: {item.quantity}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Link 
                    to={`/reviews/new?orderId=${order._id}&productId=${item.product}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 15px',
                      border: '1px solid #000',
                      color: '#000',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                    }}
                  >
                    Write Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div>
          {/* Order Summary */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Order Summary</h3>
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', color: 'green' }}>
                <span>Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Shipping Address</h3>
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.street}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p style={{ marginTop: '10px' }}>📞 {order.shippingAddress.phone}</p>
          </div>

          {/* Payment Info */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Payment Information</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Method:</strong> 💵 {order.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{ 
                color: order.paymentStatus === 'completed' ? 'green' : 'orange',
                textTransform: 'capitalize',
              }}>
                {order.paymentStatus}
              </span>
            </p>
          </div>

          {/* Track Order Button */}
          {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
            <Link 
              to={`/track-order/${order._id}`}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px',
                background: '#2196F3',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                marginTop: '20px',
                fontWeight: 'bold',
              }}
            >
              Track Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
```

---

## 🚚 TASK 4.5: Create Track Order Page (1 hour)

### File: `src/pages/TrackOrder.jsx`

```javascript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services';

function TrackOrder() {
  const { orderId } = useParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, [orderId]);

  const loadTracking = async () => {
    try {
      const response = await orderService.trackOrder(orderId);
      setTracking(response.data);
      console.log('✅ Tracking loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading tracking info...</div>;
  }

  if (!tracking) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Tracking information not available</div>;
  }

  const getStatusIcon = (status) => {
    const icons = {
      placed: '📝',
      processing: '⚙️',
      shipped: '📦',
      'out-for-delivery': '🚚',
      delivered: '✅',
      cancelled: '❌',
    };
    return icons[status] || '•';
  };

  const isCompleted = (status) => {
    const statuses = ['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];
    const currentIndex = statuses.indexOf(tracking.orderStatus);
    const statusIndex = statuses.indexOf(status);
    return statusIndex <= currentIndex;
  };

  return (
    <div className="track-order" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/orders/${orderId}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
        ← Back to Order Details
      </Link>

      <h1 style={{ marginTop: '20px' }}>Track Your Order</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
        Order Number: <strong>{tracking.orderNumber}</strong>
      </p>

      {/* Progress Bar */}
      <div style={{ margin: '40px 0' }}>
        <div style={{ position: 'relative' }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '0',
            right: '0',
            height: '4px',
            background: '#e0e0e0',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '0',
            width: `${(tracking.timeline.length / 5) * 100}%`,
            height: '4px',
            background: '#4CAF50',
            zIndex: 0,
            transition: 'width 0.5s',
          }} />

          {/* Status Steps */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            position: 'relative',
            zIndex: 1,
          }}>
            {['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered'].map((status, index) => (
              <div key={status} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: isCompleted(status) ? '#4CAF50' : '#e0e0e0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                }}>
                  {isCompleted(status) ? '✓' : index + 1}
                </div>
                <p style={{ 
                  marginTop: '10px', 
                  fontSize: '14px',
                  fontWeight: isCompleted(status) ? 'bold' : 'normal',
                  color: isCompleted(status) ? '#000' : '#666',
                  textTransform: 'capitalize',
                }}>
                  {status.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #2196F3', 
        borderRadius: '8px', 
        padding: '20px',
        marginTop: '40px',
      }}>
        <h2 style={{ marginBottom: '10px' }}>
          {getStatusIcon(tracking.orderStatus)} Current Status: <span style={{ textTransform: 'capitalize' }}>{tracking.orderStatus.replace('-', ' ')}</span>
        </h2>
        {tracking.estimatedDelivery && (
          <p style={{ fontSize: '16px', color: '#666' }}>
            Estimated Delivery: <strong>{new Date(tracking.estimatedDelivery).toLocaleDateString()}</strong>
          </p>
        )}
      </div>

      {/* Timeline Details */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Order Timeline</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          {tracking.timeline && tracking.timeline.length > 0 ? (
            tracking.timeline.slice().reverse().map((event, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '15px', 
                  borderBottom: index < tracking.timeline.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {getStatusIcon(event.status)} {event.status.replace('-', ' ')}
                    </p>
                    {event.note && (
                      <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                        {event.note}
                      </p>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#666' }}>No tracking history available yet</p>
          )}
        </div>
      </div>

      {/* Need Help */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#f9f9f9', 
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <h3 style={{ marginBottom: '10px' }}>Need Help?</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Have questions about your order?
        </p>
        <Link 
          to="/support"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default TrackOrder;
```

---

## 🔌 TASK 4.6: Update Routes (30 minutes)

### File: `src/App.jsx`

Add these routes:

```javascript
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import TrackOrder from './pages/TrackOrder';

// In your Routes:
<Route 
  path="/checkout" 
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/order-confirmation/:orderId" 
  element={
    <ProtectedRoute>
      <OrderConfirmation />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/orders" 
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/orders/:orderId" 
  element={
    <ProtectedRoute>
      <OrderDetail />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/track-order/:orderId" 
  element={
    <ProtectedRoute>
      <TrackOrder />
    </ProtectedRoute>
  } 
/>
```

---

## ✅ TESTING CHECKLIST (Feature 4)

### 1. Checkout Flow:
- [ ] Cart has items → Navigate to /checkout
- [ ] Address form displays
- [ ] Can use saved addresses (if any)
- [ ] Can enter new address
- [ ] "Save address" checkbox works
- [ ] Billing address checkbox works
- [ ] Order summary shows correct items and totals
- [ ] COD payment method displays
- [ ] Click "Place Order" → Shows loading state

### 2. Order Creation:
- [ ] Order creates successfully
- [ ] Redirects to order confirmation page
- [ ] Order number displays (MA-YYYYMMDD-XXXX)
- [ ] Cart is cleared after order
- [ ] Success message shows

### 3. Order Confirmation:
- [ ] Order details display correctly
- [ ] All items show with images
- [ ] Totals calculate correctly
- [ ] Shipping address shows
- [ ] Order number is clickable
- [ ] "View Order Details" works
- [ ] "Continue Shopping" works

### 4. Orders History:
- [ ] Navigate to /orders
- [ ] All orders display
- [ ] Orders sorted by date (newest first)
- [ ] Status badges show correct colors
- [ ] Item previews show (first 3 items)
- [ ] Click order → navigates to details

### 5. Order Details:
- [ ] Full order info displays
- [ ] Timeline shows correctly
- [ ] All items show with images
- [ ] Can click item to view product
- [ ] "Write Review" button shows
- [ ] Order summary calculates correctly
- [ ] Shipping address displays
- [ ] Payment info shows

### 6. Track Order:
- [ ] Navigate to track page
- [ ] Progress bar shows
- [ ] Current status highlighted
- [ ] Timeline events show in reverse order
- [ ] Estimated delivery shows (if available)
- [ ] Can navigate back to order details

### 7. Edge Cases:
- [ ] Empty cart → Can't checkout
- [ ] Order not found → Shows error
- [ ] Network error → Shows error message
- [ ] Form validation works
- [ ] Required fields enforce
- [ ] Phone number validation

---

## 🎯 SUCCESS CRITERIA

✅ **Complete when:**
1. Users can complete checkout with address
2. Orders create successfully in MongoDB
3. Cart clears after order
4. Order confirmation shows
5. Order history displays all orders
6. Order details show complete info
7. Tracking page works
8. All navigation works correctly

---

## 🐛 TROUBLESHOOTING

### Issue: "Cart validation failed"
**Solution:** 
- Refresh cart data
- Check stock availability
- Re-load cart page

### Issue: "Order creation failed"
**Solution:**
- Check address is complete
- Verify cart has items
- Check backend logs
- Verify authentication token

### Issue: "Order not found"
**Solution:**
- Verify order ID in URL
- Check if order belongs to logged-in user
- Check backend response

### Issue: Cart not clearing after order
**Solution:**
- Call `refreshCart()` after order creation
- Backend should auto-clear cart on order create

---

## 📝 NEXT STEPS

After completing Feature 4, you'll have:
- ✅ Complete checkout flow
- ✅ Order management
- ✅ Order history
- ✅ Order tracking

**Next:** Feature 5 - User Profile & Wishlist

---

## 💡 TIPS

1. **Test with real data** - Add items to cart, complete checkout
2. **Check console** - Watch for API responses
3. **Verify database** - Check MongoDB for order documents
4. **Test edge cases** - Empty cart, invalid addresses, etc.
5. **Mobile responsive** - Test on different screen sizes

---

**Start with Task 4.1: Checkout Page!** 🚀
