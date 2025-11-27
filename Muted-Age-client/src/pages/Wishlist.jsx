import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService, cartService } from '../services';
import { useCart } from '../contexts/CartContext';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await userService.getWishlist();
      setWishlist(response.data || []);
      console.log('✅ Wishlist loaded:', response.data.length);
    } catch (error) {
      console.error('❌ Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await userService.removeFromWishlist(productId);
      console.log('✅ Removed from wishlist');
      await loadWishlist();
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const addToCart = async (product) => {
    try {
      const variant = product.variants.find(v => v.stock > 0);

      if (!variant) {
        alert('This product is currently out of stock');
        return;
      }

      await cartService.addToCart({
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
      });

      await refreshCart();
      console.log('✅ Added to cart');
      alert('Added to cart!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{
          fontSize: '14px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#999',
          fontWeight: '300',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page" style={{ 
      minHeight: '100vh',
      background: '#FFFFFF',
      padding: '100px 40px 60px',
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        marginBottom: wishlist.length === 0 ? '0' : '60px',
      }}>
        {wishlist.length > 0 && (
          <>
            <h1 style={{ 
              fontSize: '48px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#000',
              marginBottom: '12px',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
            }}>
              My Wishlist
            </h1>
            <p style={{ 
              fontSize: '16px',
              letterSpacing: '1px',
              color: '#666',
              fontWeight: '300',
              textTransform: 'uppercase',
            }}>
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
            </p>
          </>
        )}
      </div>

      {wishlist.length === 0 ? (
        /* Empty State - Ultra Luxury Minimal */
        <div style={{ 
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 40px',
        }}>
          {/* Minimalist Heart Outline Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            marginBottom: '50px',
            position: 'relative',
          }}>
            <svg 
              viewBox="0 0 100 100" 
              style={{ width: '100%', height: '100%' }}
            >
              <path 
                d="M50,85 C50,85 15,60 15,35 C15,20 25,10 35,10 C42,10 47,14 50,20 C53,14 58,10 65,10 C75,10 85,20 85,35 C85,60 50,85 50,85 Z" 
                fill="none" 
                stroke="#999" 
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title - Bold Sans-Serif */}
          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#000',
            marginBottom: '20px',
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            lineHeight: '1.2',
          }}>
            My Wishlist
          </h1>

          {/* Item Count - Textured Street-Luxury Style */}
          <p style={{
            fontSize: '18px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '60px',
            fontWeight: '300',
          }}>
            0 Items
          </p>

          {/* Main Message - Elegant Typography */}
          <h2 style={{
            fontSize: '32px',
            fontWeight: '400',
            color: '#333',
            marginBottom: '18px',
            letterSpacing: '1px',
            lineHeight: '1.4',
          }}>
            Your wishlist is empty
          </h2>

          {/* Secondary Message - Lighter Font */}
          <p style={{
            fontSize: '16px',
            fontWeight: '300',
            color: '#666',
            marginBottom: '70px',
            letterSpacing: '0.5px',
            lineHeight: '1.6',
            maxWidth: '420px',
          }}>
            Save your favorite items to view them later
          </p>

          {/* CTA Button - Clean Black */}
          <Link
            to="/shop"
            style={{
              display: 'inline-block',
              padding: '18px 50px',
              background: '#000',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '0',
              fontSize: '14px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {wishlist.map(item => {
            const product = item.product || item;
            const inStock = product.variants?.some(v => v.stock > 0);

            return (
              <div
                key={product._id}
                style={{
                  background: '#FFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '0',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E5E5E5';
                }}
              >
                {/* Remove Button - Clean Minimal */}
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#FFF',
                    border: '1px solid #E5E5E5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#999',
                    zIndex: 1,
                    transition: 'all 0.3s ease',
                    fontWeight: '300',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000';
                    e.currentTarget.style.borderColor = '#000';
                    e.currentTarget.style.color = '#FFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFF';
                    e.currentTarget.style.borderColor = '#E5E5E5';
                    e.currentTarget.style.color = '#999';
                  }}
                  title="Remove from wishlist"
                >
                  ×
                </button>

                {/* Product Image */}
                <Link to={`/products/${product.slug}`} style={{ display: 'block' }}>
                  <div style={{ position: 'relative', paddingTop: '125%', background: '#f5f5f5' }}>
                    <img
                      src={product.images?.[0]?.url || '/placeholder.png'}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {!inStock && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '5px',
                          fontWeight: 'bold',
                        }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info - Street Luxury Minimal */}
                <div style={{ padding: '24px' }}>
                  <Link
                    to={`/products/${product.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <p style={{ 
                      fontSize: '11px', 
                      color: '#999', 
                      marginBottom: '8px', 
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontWeight: '400',
                    }}>
                      {product.brand}
                    </p>
                    <h3 style={{ 
                      fontSize: '18px', 
                      marginBottom: '14px', 
                      lineHeight: '1.4',
                      color: '#000',
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                    }}>
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price - Minimal Style */}
                  <div style={{ marginBottom: '16px' }}>
                    {product.pricing?.salePrice < product.pricing?.basePrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '20px', 
                          fontWeight: '600', 
                          color: '#000',
                          letterSpacing: '0.5px',
                        }}>
                          ${product.pricing.salePrice.toFixed(2)}
                        </span>
                        <span style={{ 
                          fontSize: '16px', 
                          color: '#999', 
                          textDecoration: 'line-through',
                          fontWeight: '300',
                        }}>
                          ${product.pricing.basePrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ 
                        fontSize: '20px', 
                        fontWeight: '600',
                        color: '#000',
                        letterSpacing: '0.5px',
                      }}>
                        ${product.pricing?.basePrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status - Minimal */}
                  <p style={{ 
                    fontSize: '11px', 
                    color: inStock ? '#666' : '#999', 
                    marginBottom: '18px', 
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    fontWeight: '400',
                  }}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </p>

                  {/* Add to Cart Button - Clean Black */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!inStock}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: inStock ? '#000' : '#E5E5E5',
                      color: inStock ? '#FFF' : '#999',
                      border: 'none',
                      borderRadius: '0',
                      cursor: inStock ? 'pointer' : 'not-allowed',
                      fontSize: '12px',
                      letterSpacing: '2.5px',
                      textTransform: 'uppercase',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (inStock) {
                        e.currentTarget.style.background = '#333';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (inStock) {
                        e.currentTarget.style.background = '#000';
                      }
                    }}
                  >
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
