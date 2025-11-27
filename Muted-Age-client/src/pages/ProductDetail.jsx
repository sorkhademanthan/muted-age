import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { productService, cartService, userService } from '../services';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductReviews from '../components/ProductReviews';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    checkWishlist();
  }, [product, user]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProductBySlug(slug);
      setProduct(response.data);
      console.log('✅ Product loaded from backend:', response.data);
    } catch (error) {
      console.error('❌ Error loading product from backend:', error);
      
      // Try to use demo product data passed from Shop page as fallback
      const demoProduct = location.state?.demoProduct;
      if (demoProduct) {
        console.log('✅ Using demo product data as fallback:', demoProduct);
        
        // Transform demo product to match backend structure
        const transformedProduct = {
          _id: demoProduct.id,
          name: demoProduct.name,
          slug: demoProduct.slug,
          description: demoProduct.description,
          brand: 'Muted Age',
          category: 'Premium Collection',
          sku: `MA-${demoProduct.id}`,
          pricing: {
            basePrice: demoProduct.price,
            salePrice: demoProduct.price,
          },
          images: [
            { url: demoProduct.image, altText: demoProduct.name },
            { url: demoProduct.imageHover, altText: `${demoProduct.name} detail` },
          ],
          variants: demoProduct.sizes.map(size => ({
            _id: `${demoProduct.id}-${size}`,
            size: size,
            stock: 20,
          })),
        };
        
        setProduct(transformedProduct);
      } else {
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user || !product) return;
    try {
      const response = await userService.getWishlist();
      const inWishlist = response.data.some(item => 
        item.product._id === product._id || item._id === product._id
      );
      setIsWishlisted(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select a size');
      return;
    }

    if (selectedVariant.stock < quantity) {
      alert('Not enough stock available');
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity: quantity,
      });

      await refreshCart();
      alert('Added to cart!');
      console.log('✅ Added to cart');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await userService.removeFromWishlist(product._id);
        setIsWishlisted(false);
        alert('Removed from wishlist');
      } else {
        await userService.addToWishlist(product._id);
        setIsWishlisted(true);
        alert('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist');
    }
  };

  const getPrice = () => {
    if (!product) return 0;
    return product.pricing.salePrice || product.pricing.basePrice;
  };

  const hasDiscount = () => {
    if (!product) return false;
    return product.pricing.salePrice < product.pricing.basePrice;
  };

  const getDiscountPercentage = () => {
    if (!hasDiscount()) return 0;
    const discount = ((product.pricing.basePrice - product.pricing.salePrice) / product.pricing.basePrice) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ 
        padding: '100px 40px', 
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
        <h1 style={{ fontSize: '32px', marginBottom: '15px', fontWeight: '300' }}>Product Not Found</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
          We couldn't find this product. It may have been removed or the link is incorrect.
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link 
            to="/shop" 
            style={{ 
              padding: '15px 40px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              letterSpacing: '1px',
              fontWeight: 'bold',
            }}
          >
            ← Back to Shop
          </Link>
          <Link 
            to="/" 
            style={{ 
              padding: '15px 40px',
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              letterSpacing: '1px',
              fontWeight: 'bold',
              border: '1px solid #ddd',
            }}
          >
            Go Home
          </Link>
        </div>
        <div style={{ 
          marginTop: '60px',
          padding: '30px',
          background: '#f9f9f9',
          borderRadius: '10px',
          maxWidth: '600px',
        }}>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
            <strong>Note for testing:</strong> This product is a demo product from the Shop page 
            but doesn't exist in your backend database yet.
          </p>
          <p style={{ fontSize: '13px', color: '#999' }}>
            To fix: Add products to your MongoDB database or update Shop.jsx to fetch from backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page" style={{ padding: '100px 40px 40px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '30px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link to="/shop" style={{ color: '#666', textDecoration: 'none' }}>Shop</Link>
        {' / '}
        <span style={{ color: '#000' }}>{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }}>
        
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div style={{ 
            width: '100%', 
            paddingTop: '125%', 
            position: 'relative', 
            background: '#f5f5f5',
            marginBottom: '20px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <img
              src={product.images[selectedImage]?.url}
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
          </div>

          {/* Thumbnail Images */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {product.images.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                style={{
                  paddingTop: '125%',
                  position: 'relative',
                  background: '#f5f5f5',
                  border: selectedImage === index ? '2px solid #000' : '2px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'border 0.2s',
                }}
              >
                <img
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          {/* Brand */}
          <p style={{ 
            fontSize: '12px', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            color: '#666',
            marginBottom: '10px',
          }}>
            {product.brand}
          </p>

          {/* Product Name */}
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '300', 
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ marginBottom: '30px' }}>
            {hasDiscount() ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>
                  ${getPrice().toFixed(2)}
                </span>
                <span style={{ 
                  fontSize: '24px', 
                  color: '#999', 
                  textDecoration: 'line-through',
                }}>
                  ${product.pricing.basePrice.toFixed(2)}
                </span>
                <span style={{ 
                  padding: '6px 12px', 
                  background: '#F44336', 
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}>
                  -{getDiscountPercentage()}%
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '32px', fontWeight: 'bold' }}>
                ${getPrice().toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.8', 
            color: '#666',
            marginBottom: '30px',
            borderBottom: '1px solid #eee',
            paddingBottom: '30px',
          }}>
            {product.description?.split('\n')[0] || 'Premium quality product from Muted Age collection.'}
          </p>

          {/* Size/Variant Selector */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold' }}>Select Size:</p>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Size Guide
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {product.variants.map((variant) => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                  style={{
                    padding: '15px',
                    border: selectedVariant?._id === variant._id ? '2px solid #000' : '1px solid #ddd',
                    background: variant.stock === 0 ? '#f5f5f5' : '#fff',
                    cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: selectedVariant?._id === variant._id ? 'bold' : 'normal',
                    textDecoration: variant.stock === 0 ? 'line-through' : 'none',
                    color: variant.stock === 0 ? '#999' : '#000',
                    borderRadius: '5px',
                    transition: 'all 0.2s',
                  }}
                >
                  {variant.size}
                </button>
              ))}
            </div>
            {selectedVariant && selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
              <p style={{ fontSize: '14px', color: '#FF9800', marginTop: '10px' }}>
                ⚠️ Only {selectedVariant.stock} left in stock!
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Quantity:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px',
                  borderRadius: '5px',
                }}
              >
                -
              </button>
              <span style={{ fontSize: '18px', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px',
                  borderRadius: '5px',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Wishlist Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
              style={{
                flex: 1,
                padding: '18px',
                background: (!selectedVariant || selectedVariant.stock === 0) ? '#ccc' : '#000',
                color: '#fff',
                border: 'none',
                cursor: (!selectedVariant || selectedVariant.stock === 0) ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: '5px',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => {
                if (selectedVariant && selectedVariant.stock > 0) {
                  e.currentTarget.style.background = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVariant && selectedVariant.stock > 0) {
                  e.currentTarget.style.background = '#000';
                }
              }}
            >
              {addingToCart ? 'Adding...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              style={{
                width: '60px',
                height: '60px',
                border: '1px solid #ddd',
                background: isWishlisted ? '#FFE0E0' : '#fff',
                cursor: 'pointer',
                fontSize: '24px',
                borderRadius: '5px',
                transition: 'all 0.3s',
              }}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Product Features */}
          <div style={{ 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            padding: '20px',
            background: '#f9f9f9',
          }}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🚚</span>
                <span style={{ fontSize: '14px' }}>Free shipping on orders over $100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>↩️</span>
                <span style={{ fontSize: '14px' }}>30-day easy returns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>✓</span>
                <span style={{ fontSize: '14px' }}>Authentic & Premium Quality</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📦</span>
                <span style={{ fontSize: '14px' }}>Secure packaging & fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div style={{ marginBottom: '80px' }}>
        {/* Tab Headers */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          borderBottom: '1px solid #eee',
          marginBottom: '40px',
        }}>
          {['description', 'details', 'shipping'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '20px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                fontSize: '16px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ maxWidth: '900px' }}>
          {activeTab === 'description' && (
            <div style={{ lineHeight: '1.8', color: '#666' }}>
              <h3 style={{ color: '#000', marginBottom: '20px' }}>Product Description</h3>
              <p style={{ marginBottom: '15px' }}>
                {product.description || 'Premium quality product from Muted Age collection. Designed with attention to detail and crafted from the finest materials.'}
              </p>
              <p style={{ marginBottom: '15px' }}>
                This piece combines contemporary style with timeless elegance, making it a perfect addition to your wardrobe. The carefully selected fabrics ensure both comfort and durability.
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Product Details</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Material:</span>
                  <span style={{ color: '#666' }}>Premium Cotton Blend</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Care Instructions:</span>
                  <span style={{ color: '#666' }}>Machine wash cold, tumble dry low</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>SKU:</span>
                  <span style={{ color: '#666' }}>{product.sku || 'MA-' + product._id.slice(-8)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Category:</span>
                  <span style={{ color: '#666' }}>{product.category}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Brand:</span>
                  <span style={{ color: '#666' }}>{product.brand}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Shipping & Returns</h3>
              <div style={{ lineHeight: '1.8', color: '#666' }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#000' }}>Free Shipping:</strong> Orders over $100 qualify for free standard shipping.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#000' }}>Delivery Time:</strong> Standard delivery takes 5-7 business days. Express shipping available at checkout.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#000' }}>Returns:</strong> We offer a 30-day return policy. Items must be unworn and in original packaging.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#000' }}>Exchanges:</strong> Free exchanges within 30 days of purchase.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product._id} />
    </div>
  );
}

export default ProductDetail;
