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
