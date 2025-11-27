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
      setSavedAddresses(response.data || []);
      
      const defaultAddress = response.data?.find(addr => addr.isDefault);
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
      const orderData = {
        shippingAddress: {
          ...shippingAddress,
          type: 'shipping',
        },
        billingAddress: sameAsShipping ? {
          ...shippingAddress,
          type: 'billing',
        } : {
          ...shippingAddress,
          type: 'billing',
        },
        paymentMethod: 'COD',
        orderNotes: orderNotes,
      };

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

      const response = await orderService.createOrder(orderData);
      console.log('✅ Order created:', response.data);

      await refreshCart();
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
        <button 
          onClick={() => navigate('/shop')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
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
        <div style={{ background: '#fee', border: '1px solid red', padding: '15px', marginTop: '20px', color: 'red', borderRadius: '5px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '30px' }}>
          
          <div>
            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <button
                  type="button"
                  onClick={() => setUseExistingAddress(!useExistingAddress)}
                  style={{ padding: '10px 20px', marginBottom: '15px', cursor: 'pointer' }}
                >
                  {useExistingAddress ? 'Enter New Address' : 'Use Saved Address'}
                </button>

                {useExistingAddress && (
                  <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
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
                          background: '#f9f9f9',
                          borderRadius: '5px',
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

            {!useExistingAddress && (
              <>
                <h2>Shipping Address</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>First Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Last Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>ZIP Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Phone *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
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

                <div style={{ marginTop: '20px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    />
                    {' '}Billing address same as shipping
                  </label>
                </div>
              </>
            )}

            <div style={{ marginTop: '30px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Order Notes (optional)</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows="4"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
          </div>

          <div>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
              <h2>Order Summary</h2>

              <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px' }}>
                {cart.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: '10px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                    <img 
                      src={item.product.images[0]?.url} 
                      alt={item.product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>{item.product.name}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        Size: {item.variant.size} × {item.quantity}
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

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

              <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Payment Method:</p>
                <p>💵 Cash on Delivery (COD)</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Pay when you receive your order
                </p>
              </div>

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
                  borderRadius: '5px',
                }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
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
