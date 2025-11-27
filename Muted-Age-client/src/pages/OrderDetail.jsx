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
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders" style={{ color: '#2196F3' }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="order-detail" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
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
        <div>
          {order.timeline && order.timeline.length > 0 && (
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '20px' }}>Order Timeline</h2>
              <div>
                {order.timeline.map((event, index) => (
                  <div key={index} style={{ position: 'relative', paddingLeft: '30px', paddingBottom: '20px' }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: getStatusColor(event.status),
                    }} />
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
            </div>
          )}

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
              </div>
            ))}
          </div>
        </div>

        <div>
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

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Shipping Address</h3>
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.street}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p style={{ marginTop: '10px' }}>📞 {order.shippingAddress.phone}</p>
          </div>

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
