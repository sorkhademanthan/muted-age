import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { reviewService, orderService } from '../services';

function WriteReview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: true,
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadOrderProduct();
  }, [orderId, productId]);

  const loadOrderProduct = async () => {
    try {
      const orderRes = await orderService.getOrderById(orderId);
      setOrder(orderRes.data);

      const item = orderRes.data.items.find(item => item.product === productId);
      if (item) {
        setProduct(item.productSnapshot);
      }

      console.log('✅ Order and product loaded');
    } catch (error) {
      console.error('❌ Error loading order/product:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.comment.length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.createReview({
        product: productId,
        order: orderId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        wouldRecommend: formData.wouldRecommend,
      });

      console.log('✅ Review submitted');
      alert('Review submitted successfully!');
      navigate('/reviews');
    } catch (err) {
      console.error('❌ Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || formData.rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, rating: i })}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          style={{
            fontSize: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: i <= displayRating ? '#FFD700' : '#ddd',
            transition: 'color 0.2s',
            padding: '0 5px',
          }}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/orders" style={{ color: '#2196F3' }}>← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="write-review-page" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/orders/${orderId}`} style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Order
      </Link>

      <h1 style={{ marginBottom: '30px' }}>Write a Review</h1>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #F44336', padding: '15px', marginBottom: '20px', borderRadius: '5px', color: '#F44336' }}>
          {error}
        </div>
      )}

      {/* Product Info */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '30px', background: '#f9f9f9' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
          />
          <div>
            <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>
              {product.brand}
            </p>
            <h3 style={{ marginBottom: '5px' }}>{product.name}</h3>
            <p style={{ color: '#666' }}>Order: {order.orderNumber}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Overall Rating *</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            {renderStars()}
            {formData.rating > 0 && (
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>
                {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>Click to rate</p>
        </div>

        {/* Review Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Summarize your experience"
            required
            maxLength={100}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Review Comment */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Tell us about your experience with this product. What did you like or dislike?"
            required
            minLength={10}
            maxLength={1000}
            rows={8}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', resize: 'vertical' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {formData.comment.length}/1000 characters (minimum 10)
          </p>
        </div>

        {/* Recommend Checkbox */}
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.wouldRecommend}
              onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.checked })}
              style={{ width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '16px' }}>
              I would recommend this product to others
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={submitting || formData.rating === 0}
            style={{
              flex: 1,
              padding: '15px',
              background: submitting || formData.rating === 0 ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: submitting || formData.rating === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <Link
            to={`/orders/${orderId}`}
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
        <h4 style={{ marginBottom: '10px' }}>Review Guidelines:</h4>
        <ul style={{ paddingLeft: '20px', color: '#666' }}>
          <li>Be honest and helpful to other shoppers</li>
          <li>Focus on the product's features and your experience</li>
          <li>Keep reviews respectful and appropriate</li>
          <li>Avoid promotional content or external links</li>
        </ul>
      </div>
    </div>
  );
}

export default WriteReview;
