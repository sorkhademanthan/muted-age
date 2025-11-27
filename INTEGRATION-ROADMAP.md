# Frontend-Backend Integration Roadmap
**Feature-by-Feature Approach** 🎯

**Strategy:** Complete one feature fully before moving to the next

---

## 📅 Overview

| Feature | Priority | Time | Dependencies | Status |
|---------|----------|------|--------------|--------|
| 0. Setup | Critical | 30 min | None | ⏳ Pending |
| 1. Authentication | Critical | 4 hours | Setup | ⏳ Pending |
| 2. Products | Critical | 6 hours | Auth | ⏳ Pending |
| 3. Shopping Cart | Critical | 6 hours | Auth, Products | ⏳ Pending |
| 4. Checkout & Orders | Critical | 6 hours | Auth, Cart | ⏳ Pending |
| 5. User Profile | High | 4 hours | Auth | ⏳ Pending |
| 6. Reviews | Medium | 4 hours | Auth, Products, Orders | ⏳ Pending |
| 7. Support System | Medium | 4 hours | Auth | ⏳ Pending |

**Total Estimated Time:** 5-7 days (1 feature per day)

---

## 🚀 FEATURE 0: Initial Setup & Configuration

**Goal:** Get the foundation ready for all integrations

**Time:** 30 minutes  
**Priority:** Critical - Must do first!

### Tasks:

#### ✅ Task 0.1: Install Dependencies
```bash
cd Muted-Age-client
npm install axios
```

#### ✅ Task 0.2: Create Environment File
**File:** `Muted-Age-client/.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=Muted Age
```

#### ✅ Task 0.3: Verify Service Files Exist
Check these files exist in `src/services/`:
- [ ] api.js
- [ ] authService.js
- [ ] productService.js
- [ ] cartService.js
- [ ] orderService.js
- [ ] reviewService.js
- [ ] userService.js
- [ ] supportService.js
- [ ] index.js

#### ✅ Task 0.4: Test API Connection
**Create:** `src/pages/TestAPI.jsx`
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

function TestAPI() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        console.log('✅ Backend connected:', response.data);
        setStatus('✅ Backend is connected!');
      })
      .catch(err => {
        console.error('❌ Connection failed:', err);
        setError('❌ Cannot connect to backend. Make sure server is running on port 5000.');
      });
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{status}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TestAPI;
```

**Add route in App.jsx:**
```javascript
import TestAPI from './pages/TestAPI';

// In routes:
<Route path="/test-api" element={<TestAPI />} />
```

**Test:** Visit http://localhost:3000/test-api

#### ✅ Task 0.5: Restart React App
```bash
# Stop current app (Ctrl+C)
npm start
```

### ✅ Completion Checklist:
- [ ] Axios installed
- [ ] .env file created
- [ ] All service files present
- [ ] Test page shows "Backend is connected"
- [ ] No console errors

### 🐛 Troubleshooting:
- If connection fails → Check backend server running on port 5000
- If CORS error → Backend already has CORS configured, restart both servers
- If .env not working → Restart React app after creating .env

---

## 🔐 FEATURE 1: Authentication System

**Goal:** Users can register, login, and access protected pages

**Time:** 4 hours  
**Priority:** Critical - Everything else depends on this!

### Pages to Create/Update:
- [ ] `src/pages/Login.jsx` (new)
- [ ] `src/pages/Register.jsx` (new)
- [ ] `src/components/Header.jsx` (update - add login/logout)
- [ ] `src/App.jsx` (add protected routes)

### Tasks:

#### ✅ Task 1.1: Create Auth Context (1 hour)
**File:** `src/contexts/AuthContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

**Wrap App in AuthProvider (App.jsx):**
```javascript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing routes */}
    </AuthProvider>
  );
}
```

#### ✅ Task 1.2: Create Login Page (1 hour)
**File:** `src/pages/Login.jsx`
```javascript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/account'); // Redirect to account page
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Login</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
```

#### ✅ Task 1.3: Create Register Page (1 hour)
**File:** `src/pages/Register.jsx`
```javascript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/account'); // Redirect after registration
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Create Account</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>First Name:</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Last Name:</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Phone:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
```

#### ✅ Task 1.4: Update Header Component (30 min)
**File:** `src/components/Header.jsx`
```javascript
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header style={{ padding: '20px', background: '#000', color: '#fff' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          MUTED AGE
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/shop" style={{ color: '#fff' }}>Shop</Link>
          <Link to="/cart" style={{ color: '#fff' }}>Cart</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/account" style={{ color: '#fff' }}>
                Hello, {user?.firstName || user?.username}
              </Link>
              <button 
                onClick={logout}
                style={{ background: 'none', border: '1px solid #fff', color: '#fff', padding: '5px 15px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff' }}>Login</Link>
              <Link to="/register" style={{ color: '#fff' }}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
```

#### ✅ Task 1.5: Add Routes (30 min)
**File:** `src/App.jsx`
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
// ... other imports

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } 
          />
          
          {/* ... other routes */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### ✅ Testing Checklist (Feature 1):
1. **Register:**
   - [ ] Go to /register
   - [ ] Fill form and submit
   - [ ] Should redirect to /account
   - [ ] User info stored in localStorage
   - [ ] Header shows "Hello, [name]"

2. **Login:**
   - [ ] Logout (if logged in)
   - [ ] Go to /login
   - [ ] Enter credentials
   - [ ] Should redirect to /account
   - [ ] Header shows user name

3. **Protected Routes:**
   - [ ] Logout
   - [ ] Try to access /account
   - [ ] Should redirect to /login

4. **Logout:**
   - [ ] Click logout button
   - [ ] Should clear localStorage
   - [ ] Header shows "Login/Register"

5. **Persistence:**
   - [ ] Login
   - [ ] Refresh page
   - [ ] Should still be logged in

### 🎯 Success Criteria:
- [ ] Users can register and login
- [ ] JWT token stored in localStorage
- [ ] Token auto-sent with API requests
- [ ] Protected routes work
- [ ] Header updates based on auth state
- [ ] Logout clears session

### 📝 Notes Before Moving to Feature 2:
- Test user credentials: `user@example.com / Password123!`
- Test admin credentials: `admin@mutedage.com / Admin123!`
- Keep browser console open to check for errors
- Check Network tab to see API calls

---

## 🛍️ FEATURE 2: Product Catalog

**Goal:** Display products from backend with search and filters

**Time:** 6 hours  
**Priority:** Critical  
**Dependencies:** Authentication (for wishlist feature)

### Pages to Create/Update:
- [ ] `src/pages/Shop.jsx` (update)
- [ ] `src/pages/ProductDetail.jsx` (new)
- [ ] `src/components/ProductCard.jsx` (new)
- [ ] `src/components/ProductFilter.jsx` (new)
- [ ] `src/components/SearchBar.jsx` (new)

### Tasks:

#### ✅ Task 2.1: Create Product Card Component (1 hour)
**File:** `src/components/ProductCard.jsx`
```javascript
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../services';
import { useAuth } from '../contexts/AuthContext';

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigation
    
    if (!isAuthenticated) {
      alert('Please login to add to wishlist');
      return;
    }

    try {
      if (inWishlist) {
        await userService.removeFromWishlist(product._id);
        setInWishlist(false);
      } else {
        await userService.addToWishlist(product._id);
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const firstVariant = product.variants?.[0];

  return (
    <Link 
      to={`/products/${product.slug}`} 
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="product-card" style={{ border: '1px solid #ddd', padding: '15px', position: 'relative' }}>
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            background: 'white', 
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>

        {/* Product Image */}
        <img 
          src={primaryImage?.url || 'https://via.placeholder.com/300'} 
          alt={product.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />

        {/* Product Info */}
        <h3>{product.name}</h3>
        
        {/* Price */}
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          ${firstVariant?.price || 'N/A'}
        </p>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div>
            {'★'.repeat(Math.round(product.averageRating))}
            {'☆'.repeat(5 - Math.round(product.averageRating))}
            <span> ({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Stock Status */}
        {firstVariant && (
          <p style={{ color: firstVariant.stock > 0 ? 'green' : 'red' }}>
            {firstVariant.stock > 0 ? `In Stock (${firstVariant.stock})` : 'Out of Stock'}
          </p>
        )}

        {/* Tags */}
        {product.isFeatured && (
          <span style={{ background: 'gold', padding: '2px 8px', fontSize: '12px' }}>
            Featured
          </span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
```

#### ✅ Task 2.2: Update Shop Page (2 hours)
**File:** `src/pages/Shop.jsx`
```javascript
import { useState, useEffect } from 'react';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      console.log('✅ Products loaded:', response.data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="shop-page" style={{ padding: '40px' }}>
      <h1>Shop</h1>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          style={{ padding: '8px' }}
        >
          <option value="newest">Newest</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          style={{ padding: '8px' }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          style={{ padding: '8px' }}
        />

        <button 
          onClick={() => setFilters({...filters, minPrice: '', maxPrice: '', category: '', sortBy: 'newest'})}
          style={{ padding: '8px 15px' }}
        >
          Clear Filters
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div 
          className="products-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px' 
          }}
        >
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Results Count */}
      <p style={{ marginTop: '20px' }}>
        Showing {products.length} products
      </p>
    </div>
  );
}

export default Shop;
```

#### ✅ Task 2.3: Create Product Detail Page (2 hours)
**File:** `src/pages/ProductDetail.jsx`
```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, cartService } from '../services';
import { useAuth } from '../contexts/AuthContext';

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProductBySlug(slug);
      setProduct(response.data);
      setSelectedVariant(response.data.variants[0]); // Select first variant
      console.log('✅ Product loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to cart');
      navigate('/login');
      return;
    }

    if (!selectedVariant) {
      alert('Please select a variant');
      return;
    }

    setAdding(true);
    try {
      await cartService.addItem(product._id, selectedVariant._id, quantity);
      alert('Added to cart!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '40px' }}>Product not found</div>;

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  return (
    <div className="product-detail" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Images */}
        <div>
          <img 
            src={primaryImage?.url || 'https://via.placeholder.com/600'} 
            alt={product.name}
            style={{ width: '100%', height: 'auto' }}
          />
          
          {/* Thumbnail Gallery */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {product.images?.map((img, index) => (
              <img 
                key={index}
                src={img.url} 
                alt={img.altText}
                style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #ddd' }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>
            ${selectedVariant?.price}
          </p>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div style={{ marginTop: '10px' }}>
              {'★'.repeat(Math.round(product.averageRating))}
              {'☆'.repeat(5 - Math.round(product.averageRating))}
              <span> ({product.reviewCount} reviews)</span>
            </div>
          )}

          {/* Description */}
          <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{product.description}</p>

          {/* Variant Selection */}
          <div style={{ marginTop: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Select Size:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.variants?.map(variant => (
                <button
                  key={variant._id}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    padding: '10px 20px',
                    border: selectedVariant?._id === variant._id ? '2px solid #000' : '1px solid #ddd',
                    background: variant.stock > 0 ? 'white' : '#f0f0f0',
                    cursor: variant.stock > 0 ? 'pointer' : 'not-allowed',
                  }}
                  disabled={variant.stock === 0}
                >
                  {variant.size}
                  {variant.stock === 0 && ' (Out of Stock)'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              max={selectedVariant?.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ padding: '8px', width: '80px' }}
            />
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {selectedVariant?.stock} available
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || !selectedVariant || selectedVariant.stock === 0}
            style={{
              marginTop: '30px',
              padding: '15px 40px',
              background: '#000',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%',
            }}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Additional Info */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>SKU:</strong> {selectedVariant?.sku}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
```

#### ✅ Task 2.4: Create Search Bar (1 hour)
**File:** `src/components/SearchBar.jsx`
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await productService.searchProducts(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        style={{ width: '100%', padding: '10px' }}
      />

      {/* Search Results Dropdown */}
      {query.length >= 2 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
        }}>
          {searching ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Searching...</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>No results found</div>
          ) : (
            results.map(product => (
              <div
                key={product._id}
                onClick={() => {
                  navigate(`/products/${product.slug}`);
                  setQuery('');
                  setResults([]);
                }}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <img 
                  src={product.images[0]?.url} 
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div>
                  <div>{product.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    ${product.variants[0]?.price}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
```

**Add to Header:**
```javascript
import SearchBar from './SearchBar';

// In Header component:
<SearchBar />
```

### ✅ Testing Checklist (Feature 2):
1. **Shop Page:**
   - [ ] Products load from backend
   - [ ] Images display correctly
   - [ ] Prices show
   - [ ] Filters work (sort, price range)
   - [ ] Stock status displays

2. **Product Detail:**
   - [ ] Click product card → navigates to detail page
   - [ ] All images show
   - [ ] Variant selection works
   - [ ] Can change quantity
   - [ ] Add to cart button works
   - [ ] Out of stock variants disabled

3. **Search:**
   - [ ] Type in search bar
   - [ ] Results appear in dropdown
   - [ ] Click result → navigates to product
   - [ ] Search works in real-time

4. **Wishlist:**
   - [ ] Heart icon works (logged in users)
   - [ ] Prompts login for non-logged users
   - [ ] Icon changes when added/removed

### 🎯 Success Criteria:
- [ ] Products load from MongoDB
- [ ] Can browse and filter products
- [ ] Product details show correctly
- [ ] Can add products to cart
- [ ] Search functionality works
- [ ] Wishlist integration works

---

## 🛒 FEATURE 3: Shopping Cart

**Goal:** Full cart functionality with live updates

**Time:** 6 hours  
**Priority:** Critical  
**Dependencies:** Authentication, Products

### Pages to Create/Update:
- [ ] `src/pages/Cart.jsx` (update)
- [ ] `src/components/CartDrawer.jsx` (update or create)
- [ ] `src/contexts/CartContext.jsx` (new - optional but recommended)

### Tasks:

#### ✅ Task 3.1: Create Cart Context (1 hour)
**File:** `src/contexts/CartContext.jsx`
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCart(response.data);
      setItemCount(response.data.itemCount || 0);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart(null);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, variantId, quantity) => {
    try {
      await cartService.addItem(productId, variantId, quantity);
      await loadCart(); // Reload cart
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, quantity);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      setItemCount(0);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const applyCoupon = async (code) => {
    try {
      await cartService.applyCoupon(code);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeCoupon = async () => {
    try {
      await cartService.removeCoupon();
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    cart,
    loading,
    itemCount,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

**Wrap App in CartProvider (App.jsx):**
```javascript
import { CartProvider } from './contexts/CartContext';

<AuthProvider>
  <CartProvider>
    {/* Routes */}
  </CartProvider>
</AuthProvider>
```

#### ✅ Task 3.2: Create Full Cart Page (2 hours)
**File:** `src/pages/Cart.jsx`
```javascript
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Cart() {
  const { cart, loading, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Please login to view your cart</h2>
        <Link to="/login">Login here</Link>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <Link to="/shop">Continue Shopping</Link>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeItem(itemId);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    const result = await applyCoupon(couponCode);
    setCouponLoading(false);
    
    if (result.success) {
      alert('Coupon applied!');
      setCouponCode('');
    } else {
      alert('Invalid coupon: ' + result.error);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  return (
    <div className="cart-page" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Shopping Cart ({cart.itemCount} items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '30px' }}>
        {/* Cart Items */}
        <div>
          {cart.items.map(item => (
            <div 
              key={item._id} 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '100px 1fr auto', 
                gap: '20px', 
                padding: '20px', 
                border: '1px solid #ddd',
                marginBottom: '15px'
              }}
            >
              {/* Product Image */}
              <img 
                src={item.product.images[0]?.url} 
                alt={item.product.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />

              {/* Product Info */}
              <div>
                <h3>{item.product.name}</h3>
                <p>Size: {item.variant.size}</p>
                {item.variant.color && <p>Color: {item.variant.color}</p>}
                <p>Price: ${item.price}</p>

                {/* Quantity Selector */}
                <div style={{ marginTop: '10px' }}>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    style={{ padding: '5px 10px' }}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 15px' }}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    style={{ padding: '5px 10px' }}
                  >
                    +
                  </button>
                </div>

                {/* Low Stock Warning */}
                {item.variant.stock <= 5 && (
                  <p style={{ color: 'orange', marginTop: '5px' }}>
                    Only {item.variant.stock} left in stock!
                  </p>
                )}
              </div>

              {/* Subtotal & Remove */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  ${item.subtotal.toFixed(2)}
                </p>
                <button 
                  onClick={() => handleRemove(item._id)}
                  style={{ marginTop: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div style={{ border: '1px solid #ddd', padding: '20px', height: 'fit-content' }}>
          <h2>Order Summary</h2>

          <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal:</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Tax:</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping:</span>
              <span>${cart.shipping.toFixed(2)}</span>
            </div>

            {cart.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'green' }}>
                <span>Discount ({cart.couponCode}):</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>

          {/* Coupon Code */}
          <div style={{ marginTop: '20px' }}>
            {cart.couponCode ? (
              <div>
                <p style={{ color: 'green' }}>
                  ✓ Coupon applied: {cart.couponCode}
                </p>
                <button 
                  onClick={handleRemoveCoupon}
                  style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                >
                  Remove Coupon
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  style={{ width: '100%', padding: '10px' }}
                >
                  {couponLoading ? 'Applying...' : 'Apply Coupon'}
                </button>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button 
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '15px',
              background: '#000',
              color: '#fff',
              border: 'none',
              marginTop: '20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
```

#### ✅ Task 3.3: Update Header with Cart Count (30 min)
**File:** `src/components/Header.jsx`
```javascript
import { useCart } from '../contexts/CartContext';

function Header() {
  const { itemCount } = useCart();

  return (
    // ... existing code
    <Link to="/cart" style={{ color: '#fff', position: 'relative' }}>
      Cart
      {itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px'
        }}>
          {itemCount}
        </span>
      )}
    </Link>
  );
}
```

#### ✅ Task 3.4: Update ProductDetail Add to Cart (30 min)
**File:** `src/pages/ProductDetail.jsx`
```javascript
import { useCart } from '../contexts/CartContext';

function ProductDetail() {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    const result = await addItem(product._id, selectedVariant._id, quantity);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert('Error: ' + result.error);
    }
  };
  
  // ... rest of component
}
```

#### ✅ Task 3.5: Create Mini Cart Drawer (Optional - 2 hours)
**File:** `src/components/CartDrawer.jsx`
```javascript
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function CartDrawer({ isOpen, onClose }) {
  const { cart, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '400px',
        background: 'white',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Cart ({cart?.itemCount || 0})</h2>
          <button onClick={onClose} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.items.map(item => (
              <div key={item._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img 
                    src={item.product.images[0]?.url} 
                    alt={item.product.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4>{item.product.name}</h4>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {item.variant.size} × {item.quantity}
                    </p>
                    <p>${item.subtotal.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item._id)}
                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/cart"
              onClick={onClose}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px',
                background: '#000',
                color: '#fff',
                textDecoration: 'none',
                marginTop: '20px'
              }}
            >
              View Full Cart
            </Link>

            <Link 
              to="/checkout"
              onClick={onClose}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '15px',
                background: '#4CAF50',
                color: '#fff',
                textDecoration: 'none',
                marginTop: '10px'
              }}
            >
              Checkout
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
```

### ✅ Testing Checklist (Feature 3):
1. **Add to Cart:**
   - [ ] Click "Add to Cart" on product
   - [ ] Cart count increases in header
   - [ ] Item appears in cart

2. **Cart Page:**
   - [ ] All items display correctly
   - [ ] Can update quantity
   - [ ] Can remove items
   - [ ] Totals calculate correctly
   - [ ] Stock warnings show

3. **Coupon:**
   - [ ] Can apply coupon code
   - [ ] Discount applies to total
   - [ ] Can remove coupon

4. **Persistence:**
   - [ ] Refresh page → cart persists
   - [ ] Logout → cart clears
   - [ ] Login → cart loads

### 🎯 Success Criteria:
- [ ] Can add products to cart
- [ ] Cart updates in real-time
- [ ] All calculations correct
- [ ] Coupons work
- [ ] Cart persists in MongoDB

---

## 📝 To Be Continued...

**Next Features in Roadmap:**
- Feature 4: Checkout & Orders
- Feature 5: User Profile & Wishlist
- Feature 6: Reviews & Ratings
- Feature 7: Support System

---

## 📊 Progress Tracker

| Feature | Status | Completion |
|---------|--------|------------|
| 0. Setup | ⏳ | 0% |
| 1. Authentication | ⏳ | 0% |
| 2. Products | ⏳ | 0% |
| 3. Shopping Cart | ⏳ | 0% |
| 4. Orders | ⏳ | 0% |
| 5. User Profile | ⏳ | 0% |
| 6. Reviews | ⏳ | 0% |
| 7. Support | ⏳ | 0% |

**Overall Progress:** 0/8 (0%)

---

## 💡 Tips for Success

1. **One Feature at a Time** - Complete fully before moving on
2. **Test Immediately** - Test after each task
3. **Check Console** - Always have browser console open
4. **Git Commits** - Commit after each feature completion
5. **Take Breaks** - Don't rush, take breaks between features
6. **Ask Questions** - If stuck, review documentation or ask

---

## 🆘 Getting Help

If you get stuck:
1. Check browser console for errors
2. Check Network tab in DevTools
3. Verify backend is running
4. Check service files are imported correctly
5. Review QUICK-START-INTEGRATION.md

---

**Start with Feature 0: Setup!** 🚀
