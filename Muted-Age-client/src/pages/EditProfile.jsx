import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services';

function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    try {
      setLoading(true);
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      if (showPasswordFields && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await userService.updateProfile(updateData);
      if (updateUser) {
        updateUser(response.data);
      }
      
      setSuccess('Profile updated successfully!');
      console.log('✅ Profile updated');

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/profile" style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Profile
      </Link>

      <h1 style={{ marginBottom: '30px' }}>Edit Profile</h1>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #F44336', padding: '15px', marginBottom: '20px', borderRadius: '5px', color: '#F44336' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#e8f5e9', border: '1px solid #4CAF50', padding: '15px', marginBottom: '20px', borderRadius: '5px', color: '#4CAF50' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                background: '#f5f5f5',
                color: '#666',
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Email cannot be changed</p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>
        </div>

        {/* Password Change */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Change Password</h3>
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              style={{
                padding: '8px 15px',
                background: showPasswordFields ? '#F44336' : '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordFields && (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength="6"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '15px',
              background: loading ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            to="/profile"
            style={{
              flex: 1,
              padding: '15px',
              background: '#fff',
              color: '#000',
              border: '1px solid #000',
              borderRadius: '5px',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
