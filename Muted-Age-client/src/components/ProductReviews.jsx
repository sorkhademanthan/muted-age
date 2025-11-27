import { useEffect, useState } from 'react';
import { reviewService } from '../services';

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId, sortBy]);

  const loadReviews = async (pageNum = 1) => {
    try {
      const response = await reviewService.getProductReviews(productId, {
        sortBy,
        page: pageNum,
        limit: 10,
      });

      if (pageNum === 1) {
        setReviews(response.data.reviews || []);
      } else {
        setReviews(prev => [...prev, ...(response.data.reviews || [])]);
      }

      setStats(response.data.stats || { averageRating: 0, totalReviews: 0, distribution: {} });
      setHasMore(response.data.hasMore || false);
      setPage(pageNum);

      console.log('✅ Product reviews loaded');
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      await loadReviews(1);
      console.log('✅ Marked helpful');
    } catch (error) {
      console.error('❌ Error marking helpful:', error);
    }
  };

  const renderStars = (rating, size = '20px') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: size,
            color: i <= rating ? '#FFD700' : '#ddd',
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getDistributionPercentage = (count) => {
    if (stats.totalReviews === 0) return 0;
    return Math.round((count / stats.totalReviews) * 100);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading reviews...</div>;
  }

  return (
    <div className="product-reviews" style={{ padding: '40px 0' }}>
      <h2 style={{ marginBottom: '30px' }}>Customer Reviews</h2>

      {/* Review Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', marginBottom: '40px', padding: '30px', background: '#f9f9f9', borderRadius: '8px' }}>
        {/* Left: Overall Rating */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
            {stats.averageRating.toFixed(1)}
          </div>
          <div style={{ marginBottom: '10px' }}>
            {renderStars(Math.round(stats.averageRating), '24px')}
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Right: Star Distribution */}
        <div>
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', width: '50px' }}>{star} stars</span>
              <div style={{ flex: 1, height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${getDistributionPercentage(stats.distribution[star] || 0)}%`,
                    height: '100%',
                    background: '#FFD700',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', width: '50px', textAlign: 'right', color: '#666' }}>
                {stats.distribution[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{stats.totalReviews} Reviews</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⭐</div>
          <h3 style={{ marginBottom: '10px' }}>No reviews yet</h3>
          <p style={{ color: '#666' }}>Be the first to review this product!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '25px' }}>
          {reviews.map(review => (
            <div
              key={review._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '25px',
              }}
            >
              {/* Reviewer Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {review.user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>
                        {review.user.firstName} {review.user.lastName?.[0] || ''}.
                      </p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {review.isVerifiedPurchase && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#4CAF50',
                      background: '#e8f5e9',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓ Verified Purchase
                  </span>
                )}
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '10px' }}>
                {renderStars(review.rating)}
              </div>

              {/* Review Title */}
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                {review.title}
              </h4>

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

              {/* Helpful Button */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <button
                  onClick={() => markHelpful(review._id)}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  👍 Helpful
                  {review.helpfulCount > 0 && <span>({review.helpfulCount})</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => loadReviews(page + 1)}
            style={{
              padding: '12px 30px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
