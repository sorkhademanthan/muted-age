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

  const isCompleted = (status) => {
    const statuses = ['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];
    const currentIndex = statuses.indexOf(tracking.orderStatus);
    const statusIndex = statuses.indexOf(status);
    return statusIndex <= currentIndex;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading tracking info...</div>;
  }

  if (!tracking) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Tracking information not available</h2>
        <Link to="/orders" style={{ color: '#2196F3' }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="track-order" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/orders/${orderId}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
        ← Back to Order Details
      </Link>

      <h1 style={{ marginTop: '20px' }}>Track Your Order</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
        Order Number: <strong>{tracking.orderNumber}</strong>
      </p>

      <div style={{ margin: '40px 0' }}>
        <div style={{ position: 'relative' }}>
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

      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #2196F3', 
        borderRadius: '8px', 
        padding: '20px',
        marginTop: '40px',
      }}>
        <h2 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>
          Current Status: {tracking.orderStatus.replace('-', ' ')}
        </h2>
        {tracking.estimatedDelivery && (
          <p style={{ fontSize: '16px', color: '#666' }}>
            Estimated Delivery: <strong>{new Date(tracking.estimatedDelivery).toLocaleDateString()}</strong>
          </p>
        )}
      </div>

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
                      {event.status.replace('-', ' ')}
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
