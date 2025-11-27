# Quick Start: Frontend-Backend Integration

**Everything is ready! Just follow these steps** 🚀

---

## ✅ What I've Created For You:

### API Layer (All Done!)
```
src/
├── config/
│   └── api.js              ✅ API endpoints configuration
├── services/
│   ├── api.js              ✅ Axios instance with interceptors
│   ├── authService.js      ✅ Login, register, logout
│   ├── productService.js   ✅ Browse, search products
│   ├── cartService.js      ✅ Cart operations
│   ├── orderService.js     ✅ Create & track orders
│   ├── reviewService.js    ✅ Submit & manage reviews
│   ├── userService.js      ✅ Profile, wishlist, addresses
│   ├── supportService.js   ✅ Support tickets
│   └── index.js            ✅ Export all services
```

---

## 🚀 Step 1: Install Axios (1 minute)

```bash
cd Muted-Age-client
npm install axios
```

---

## 🔧 Step 2: Create .env File (1 minute)

**File:** `Muted-Age-client/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Important:** Restart your React app after creating .env file!

---

## 📝 Step 3: Test API Connection (2 minutes)

**Create test file:** `src/pages/TestAPI.jsx`

```javascript
import { useEffect, useState } from 'react';
import { productService } from '../services';

function TestAPI() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Test loading products
    productService.getProducts({ limit: 5 })
      .then(data => {
        console.log('✅ API Working!', data);
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>✅ API Connected!</h1>
      <p>Found {products.length} products</p>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}

export default TestAPI;
```

**Add route in App.jsx:**
```javascript
import TestAPI from './pages/TestAPI';

<Route path="/test-api" element={<TestAPI />} />
```

**Visit:** http://localhost:3000/test-api

**Expected:** You should see products loaded from backend!

---

## 💡 Step 4: Use Services in Your Components

### Example 1: Login Page

```javascript
import { useState } from 'react';
import { authService } from '../services';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      console.log('Login success:', response);
      // Redirect to dashboard
      window.location.href = '/account';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### Example 2: Product List (Shop.jsx)

```javascript
import { useEffect, useState } from 'react';
import { productService } from '../services';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts({
        limit: 20,
        sortBy: 'newest'
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="shop">
      <h1>Shop</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

### Example 3: Add to Cart

```javascript
import { cartService } from '../services';
import { useState } from 'react';

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      // Assuming first variant
      const variant = product.variants[0];
      await cartService.addItem(product._id, variant._id, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.images[0]?.url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.variants[0]?.price}</p>
      <button onClick={handleAddToCart} disabled={adding}>
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

---

### Example 4: View Cart

```javascript
import { useEffect, useState } from 'react';
import { cartService } from '../services';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, quantity);
      loadCart(); // Reload cart
    } catch (error) {
      alert('Error updating quantity');
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (!cart || cart.items.length === 0) return <div>Cart is empty</div>;

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      {cart.items.map(item => (
        <div key={item._id} className="cart-item">
          <img src={item.product.images[0]?.url} alt={item.product.name} />
          <h3>{item.product.name}</h3>
          <p>Size: {item.variant.size}</p>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => handleUpdateQuantity(item._id, e.target.value)}
          />
          <p>${item.price * item.quantity}</p>
        </div>
      ))}
      <div className="cart-totals">
        <p>Subtotal: ${cart.subtotal}</p>
        <p>Tax: ${cart.tax}</p>
        <p>Shipping: ${cart.shipping}</p>
        <h2>Total: ${cart.total}</h2>
      </div>
    </div>
  );
}
```

---

### Example 5: Support Ticket

```javascript
import { useState } from 'react';
import { supportService } from '../services';

function SupportForm() {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'General Inquiry',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await supportService.createTicket(formData);
      setSuccess(true);
      alert(`Ticket created! Number: ${response.data.ticketNumber}`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        placeholder="Subject"
        required
      />
      <textarea 
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Describe your issue..."
        required
      />
      <select 
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option>General Inquiry</option>
        <option>Product Quality</option>
        <option>Delivery Issue</option>
        <option>Payment Problem</option>
        <option>Return/Refund</option>
      </select>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}
```

---

## 🎯 Integration Checklist

### Day 1: Setup & Auth
- [x] Install axios
- [x] Create .env file
- [ ] Test API connection
- [ ] Add login functionality
- [ ] Add register functionality
- [ ] Test authentication flow

### Day 2: Products & Cart
- [ ] Integrate Shop.jsx with productService
- [ ] Integrate Catalog.jsx with productService
- [ ] Integrate product search
- [ ] Integrate cart functionality
- [ ] Test add/remove from cart

### Day 3: Checkout & Orders
- [ ] Integrate Checkout.jsx
- [ ] Create order from cart
- [ ] Show order confirmation
- [ ] Integrate Orders.jsx
- [ ] Test complete purchase flow

### Day 4: User Features
- [ ] Integrate Profile.jsx
- [ ] Integrate wishlist
- [ ] Integrate addresses
- [ ] Test all user features

### Day 5: Support & Reviews
- [ ] Integrate Support.jsx
- [ ] Create support tickets
- [ ] Integrate Reviews.jsx
- [ ] Test ticket creation & viewing

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** "Access to XMLHttpRequest blocked by CORS"

**Solution:** Backend already has CORS configured. Make sure:
- Backend is running on port 5000
- Frontend .env has correct API URL
- Both servers are running

---

### Issue 2: 401 Unauthorized
**Error:** "Token is not valid" or "No token"

**Solution:**
- Make sure user is logged in
- Check localStorage for 'token'
- Token auto-attaches via interceptor

---

### Issue 3: Network Error
**Error:** "Network error. Please try again."

**Solution:**
- Check if backend server is running: `http://localhost:5000/api/health`
- Check .env file has correct API_URL
- Restart React app after changing .env

---

### Issue 4: Empty Response
**Error:** Getting empty arrays/objects

**Solution:**
- Make sure you have test data in database
- Run: `node setup-test-users.js` in backend
- Create some products via admin panel

---

## 📚 Available Services

### authService
```javascript
import { authService } from '../services';

authService.register(userData)
authService.login(email, password)
authService.logout()
authService.isAuthenticated()
authService.getStoredUser()
```

### productService
```javascript
import { productService } from '../services';

productService.getProducts(filters)
productService.getProductBySlug(slug)
productService.searchProducts(query)
productService.getNewArrivals()
productService.getByCategory(category)
```

### cartService
```javascript
import { cartService } from '../services';

cartService.getCart()
cartService.addItem(productId, variantId, quantity)
cartService.updateItem(itemId, quantity)
cartService.removeItem(itemId)
cartService.clearCart()
cartService.applyCoupon(code)
cartService.validateCart()
```

### orderService
```javascript
import { orderService } from '../services';

orderService.createOrder(orderData)
orderService.getOrders()
orderService.getOrderById(orderId)
orderService.trackOrder(orderId)
```

### reviewService
```javascript
import { reviewService } from '../services';

reviewService.getProductReviews(productId)
reviewService.submitReview(productId, reviewData)
reviewService.updateReview(reviewId, reviewData)
reviewService.getUserReviews()
```

### userService
```javascript
import { userService } from '../services';

userService.getProfile()
userService.updateProfile(profileData)
userService.getWishlist()
userService.addToWishlist(productId)
userService.getAddresses()
userService.addAddress(addressData)
```

### supportService
```javascript
import { supportService } from '../services';

supportService.createTicket(ticketData)
supportService.getTickets(filters)
supportService.getTicketById(ticketId)
supportService.addMessage(ticketId, message)
supportService.reopenTicket(ticketId, reason)
```

---

## ✅ Next Steps

1. **Install axios** (1 min)
2. **Create .env** (1 min)
3. **Test API connection** (2 min)
4. **Start integrating features** (rest of week)

---

## 🆘 Need Help?

- Check `FRONTEND-INTEGRATION-PLAN.md` for detailed guide
- All services are in `src/services/`
- All endpoints configured in `src/config/api.js`
- Test with test user: `user@example.com / Password123!`

**You're all set! Start with Step 1 now** 🚀
