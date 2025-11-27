import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services';

function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    type: 'shipping',
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await userService.getAddresses();
      setAddresses(response.data || []);
      console.log('✅ Addresses loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      type: 'shipping',
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      type: address.type || 'shipping',
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, formData);
        console.log('✅ Address updated');
      } else {
        await userService.addAddress(formData);
        console.log('✅ Address added');
      }

      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error('❌ Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await userService.deleteAddress(id);
        console.log('✅ Address deleted');
        await loadAddresses();
      } catch (error) {
        console.error('❌ Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      }
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      console.log('✅ Default address set');
      await loadAddresses();
    } catch (error) {
      console.error('❌ Error setting default:', error);
      alert('Failed to set default address. Please try again.');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading addresses...</div>;
  }

  return (
    <div className="address-book-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/profile" style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Profile
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Address Book</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Address Form */}
      {showForm && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '30px', background: '#f9f9f9' }}>
          <h2 style={{ marginBottom: '20px' }}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>

          <form onSubmit={handleSubmit}>
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
                Street Address *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: formLoading ? '#ccc' : '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {formLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            No addresses saved yet
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {addresses.map(address => (
            <div
              key={address._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                position: 'relative',
                background: address.isDefault ? '#f0f9ff' : '#fff',
              }}
            >
              {address.isDefault && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 8px',
                    background: '#4CAF50',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ Default
                </span>
              )}

              <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                {address.firstName} {address.lastName}
              </p>
              <p style={{ color: '#666', marginBottom: '5px' }}>{address.street}</p>
              {address.apartment && (
                <p style={{ color: '#666', marginBottom: '5px' }}>{address.apartment}</p>
              )}
              <p style={{ color: '#666', marginBottom: '5px' }}>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p style={{ color: '#666', marginBottom: '10px' }}>{address.country}</p>
              <p style={{ color: '#666', marginBottom: '15px' }}>📞 {address.phone}</p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(address)}
                  style={{
                    padding: '8px 12px',
                    background: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(address._id)}
                    style={{
                      padding: '8px 12px',
                      background: '#fff',
                      color: '#4CAF50',
                      border: '1px solid #4CAF50',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address._id)}
                  style={{
                    padding: '8px 12px',
                    background: '#fff',
                    color: '#F44336',
                    border: '1px solid #F44336',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressBook;
