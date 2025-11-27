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
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/shop" style={{ color: '#2196F3' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '60px', color: 'green' }}>✓</div>
        <h1 style={{ marginTop: '20px' }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
          Thank you for your order. We've received your order and will process it shortly.
        </p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '30px', background: '#f9f9f9', borderRadius: '8px' }}>
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

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Shipping Address:</h3>
          <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p>{order.shippingAddress.street} {order.shippingAddress.apartment}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Order Items ({order.items.length}):</h3>
          {order.items.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', padding: '15px', background: 'white', borderRadius: '5px' }}>
              <img 
                src={item.productSnapshot.image} 
                alt={item.productSnapshot.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold' }}>{item.productSnapshot.name}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Size: {item.variant.size} × {item.quantity}
                </p>
                <p style={{ fontSize: '16px', marginTop: '5px', fontWeight: 'bold' }}>${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
        📧 A confirmation email will be sent to <strong>{order.user.email}</strong>
      </p>
    </div>
  );
}

export default OrderConfirmation;
