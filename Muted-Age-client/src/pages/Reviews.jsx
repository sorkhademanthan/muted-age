import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../services';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getUserReviews();
      setReviews(response.data || []);
      console.log('✅ Reviews loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        console.log('✅ Review deleted');
        await loadReviews();
      } catch (error) {
        console.error('❌ Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: '20px',
            color: i <= rating ? '#FFD700' : '#ddd',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reviews...</div>;
  }

  return (
    <div className="reviews-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/profile" style={{ color: '#2196F3', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
        ← Back to Profile
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>My Reviews</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⭐</div>
          <h2 style={{ marginBottom: '15px' }}>No Reviews Yet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Share your experience by reviewing products you've purchased
          </p>
          <Link
            to="/orders"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
            }}
          >
            View Orders
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {reviews.map(review => (
            <div
              key={review._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '25px',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Product Image */}
                <Link to={`/products/${review.product.slug}`}>
                  <img
                    src={review.product.images?.[0]?.url}
                    alt={review.product.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                </Link>

                {/* Review Content */}
                <div style={{ flex: 1 }}>
                  {/* Product Name */}
                  <Link
                    to={`/products/${review.product.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', marginBottom: '5px' }}>
                      {review.product.brand}
                    </p>
                    <h3 style={{ marginBottom: '10px' }}>{review.product.name}</h3>
                  </Link>

                  {/* Rating and Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex' }}>
                      {renderStars(review.rating)}
                    </div>
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span style={{ fontSize: '12px', color: '#4CAF50', background: '#e8f5e9', padding: '4px 8px', borderRadius: '5px' }}>
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  <h4 style={{ marginBottom: '10px', fontSize: '18px' }}>{review.title}</h4>

                  {/* Review Comment */}
                  <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
                    {review.comment}
                  </p>

                  {/* Would Recommend */}
                  {review.wouldRecommend && (
                    <p style={{ fontSize: '14px', color: '#4CAF50', marginBottom: '15px' }}>
                      👍 I would recommend this product
                    </p>
                  )}

                  {/* Helpful Count */}
                  {review.helpfulCount > 0 && (
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                      {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                    </p>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      to={`/reviews/edit/${review._id}`}
                      style={{
                        padding: '8px 16px',
                        background: '#2196F3',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    >
                      Edit Review
                    </Link>
                    <button
                      onClick={() => handleDelete(review._id)}
                      style={{
                        padding: '8px 16px',
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
