import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService, orderService } from '../services';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    addressCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [user, navigate]);

  const loadProfileData = async () => {
    try {
      const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
        orderService.getOrders().catch(() => ({ data: [] })),
        userService.getWishlist().catch(() => ({ data: [] })),
        userService.getAddresses().catch(() => ({ data: [] })),
      ]);

      setStats({
        totalOrders: ordersRes.data.length || 0,
        wishlistCount: wishlistRes.data.length || 0,
        addressCount: addressesRes.data.length || 0,
      });

      setRecentOrders(ordersRes.data.slice(0, 3) || []);
      console.log('✅ Profile data loaded');
    } catch (error) {
      console.error('❌ Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
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
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;
  }

  return (
    <div className="profile-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Left Sidebar */}
        <div>
          {/* User Info Card */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 auto 20px',
            }}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ marginBottom: '5px' }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{user?.email}</p>
            {user?.phone && (
              <p style={{ color: '#666', marginBottom: '20px' }}>📞 {user.phone}</p>
            )}
            <Link
              to="/profile/edit"
              style={{
                display: 'block',
                padding: '10px',
                background: '#000',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: '#fff',
                color: '#F44336',
                border: '1px solid #F44336',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Logout
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
            <Link
              to="/orders"
              style={{
                display: 'block',
                padding: '12px',
                background: '#f9f9f9',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              📦 My Orders
            </Link>
            <Link
              to="/wishlist"
              style={{
                display: 'block',
                padding: '12px',
                background: '#f9f9f9',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              ❤️ Wishlist
            </Link>
            <Link
              to="/profile/addresses"
              style={{
                display: 'block',
                padding: '12px',
                background: '#f9f9f9',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
              }}
            >
              📍 Address Book
            </Link>
            <Link
              to="/support"
              style={{
                display: 'block',
                padding: '12px',
                background: '#f9f9f9',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              💬 Support
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3', marginBottom: '10px' }}>
                {stats.totalOrders}
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>Total Orders</p>
            </div>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#F44336', marginBottom: '10px' }}>
                {stats.wishlistCount}
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>Wishlist Items</p>
            </div>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' }}>
                {stats.addressCount}
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>Saved Addresses</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Recent Orders</h2>
              <Link to="/orders" style={{ color: '#2196F3', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p style={{ marginBottom: '20px' }}>You haven't placed any orders yet</p>
                <Link
                  to="/shop"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: '#000',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '5px',
                  }}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div>
                {recentOrders.map(order => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      style={{
                        padding: '15px',
                        background: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            Order {order.orderNumber}
                          </p>
                          <p style={{ fontSize: '14px', color: '#666' }}>
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              padding: '5px 10px',
                              background: getStatusColor(order.orderStatus),
                              color: 'white',
                              borderRadius: '5px',
                              fontSize: '12px',
                              textTransform: 'capitalize',
                              display: 'inline-block',
                              marginBottom: '5px',
                            }}
                          >
                            {order.orderStatus}
                          </span>
                          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Account Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Member Since</p>
                <p style={{ fontWeight: 'bold' }}>
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Email Verified</p>
                <p style={{ fontWeight: 'bold', color: user?.isEmailVerified ? '#4CAF50' : '#FF9800' }}>
                  {user?.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
