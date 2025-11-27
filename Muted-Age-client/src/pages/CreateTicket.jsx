import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supportService } from '../services';

function CreateTicket() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    orderReference: '',
  });

  const categories = [
    { value: 'order', label: 'Order Issue', icon: '📦', desc: 'Problems with your order' },
    { value: 'product', label: 'Product Question', icon: '🛍️', desc: 'Questions about products' },
    { value: 'shipping', label: 'Shipping & Delivery', icon: '🚚', desc: 'Shipping or delivery issues' },
    { value: 'return', label: 'Return & Refund', icon: '↩️', desc: 'Return or refund requests' },
    { value: 'account', label: 'Account & Login', icon: '👤', desc: 'Account or login problems' },
    { value: 'payment', label: 'Payment Issue', icon: '💳', desc: 'Payment or billing issues' },
    { value: 'technical', label: 'Technical Problem', icon: '⚙️', desc: 'Website technical issues' },
    { value: 'other', label: 'Other', icon: '❓', desc: 'Other inquiries' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#4CAF50', desc: 'General inquiry' },
    { value: 'medium', label: 'Medium', color: '#2196F3', desc: 'Normal issue' },
    { value: 'high', label: 'High', color: '#FF9800', desc: 'Important issue' },
    { value: 'urgent', label: 'Urgent', color: '#F44336', desc: 'Critical issue' },
  ];

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

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (formData.subject.length < 5) {
      setError('Subject must be at least 5 characters');
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }

    try {
      setSubmitting(true);
      const response = await supportService.createTicket(formData);
      console.log('✅ Ticket created:', response.data);
      alert('Ticket created successfully! Our support team will respond soon.');
      navigate(`/support/${response.data._id}`);
    } catch (err) {
      console.error('❌ Error creating ticket:', err);
      setError(err.response?.data?.message || 'Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-ticket-page" style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/support" style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Support Center
      </Link>

      <h1 style={{ marginBottom: '10px' }}>Create Support Ticket</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Fill out the form below and our support team will get back to you within 24 hours.
      </p>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #F44336', padding: '15px', marginBottom: '20px', borderRadius: '5px', color: '#F44336' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', fontSize: '16px' }}>
            Select Category *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {categories.map(cat => (
              <div
                key={cat.value}
                onClick={() => setFormData({ ...formData, category: cat.value })}
                style={{
                  padding: '15px',
                  border: formData.category === cat.value ? '2px solid #2196F3' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: formData.category === cat.value ? '#f0f9ff' : '#fff',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{cat.label}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Selection */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Priority Level *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {priorities.map(pri => (
              <button
                key={pri.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: pri.value })}
                style={{
                  padding: '12px',
                  border: formData.priority === pri.value ? `2px solid ${pri.color}` : '1px solid #ddd',
                  borderRadius: '5px',
                  background: formData.priority === pri.value ? `${pri.color}20` : '#fff',
                  cursor: 'pointer',
                  fontWeight: formData.priority === pri.value ? 'bold' : 'normal',
                }}
              >
                <div style={{ color: pri.color, fontWeight: 'bold', marginBottom: '4px' }}>{pri.label}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{pri.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief description of your issue"
            required
            maxLength={200}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {formData.subject.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe your issue in detail. Include any relevant information that will help us assist you."
            required
            minLength={20}
            maxLength={2000}
            rows={8}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', resize: 'vertical' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {formData.description.length}/2000 characters (minimum 20)
          </p>
        </div>

        {/* Order Reference */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Order Number (Optional)
          </label>
          <input
            type="text"
            name="orderReference"
            value={formData.orderReference}
            onChange={handleChange}
            placeholder="e.g., MA-20251127-0001"
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            If your issue is related to a specific order, please provide the order number
          </p>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={submitting || !formData.category}
            style={{
              flex: 1,
              padding: '15px',
              background: submitting || !formData.category ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: submitting || !formData.category ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Creating Ticket...' : 'Create Ticket'}
          </button>
          <Link
            to="/support"
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Guidelines */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #2196F3' }}>
        <h4 style={{ marginBottom: '10px' }}>Support Guidelines:</h4>
        <ul style={{ paddingLeft: '20px', color: '#666' }}>
          <li>Our team typically responds within 24 hours</li>
          <li>Urgent issues are prioritized and addressed faster</li>
          <li>Please provide as much detail as possible</li>
          <li>Include order numbers for order-related issues</li>
          <li>You'll receive email notifications for responses</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateTicket;
