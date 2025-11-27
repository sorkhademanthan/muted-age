# Feature 5: User Profile & Wishlist Integration

**Goal:** Complete user profile management and wishlist functionality

**Time:** 4 hours  
**Priority:** High  
**Dependencies:** Authentication ✅, Products ✅

---

## 📋 Overview

### What We'll Build:
1. **User Profile Page** - View and edit user information
2. **Edit Profile Page** - Update personal details
3. **Address Book Page** - Manage shipping/billing addresses
4. **Wishlist Page** - Save and manage favorite products

### Backend Endpoints We'll Use:
```javascript
GET    /api/users/profile              // Get user profile
PUT    /api/users/profile              // Update profile
GET    /api/users/addresses            // Get addresses
POST   /api/users/addresses            // Add address
PUT    /api/users/addresses/:id        // Update address
DELETE /api/users/addresses/:id        // Delete address
GET    /api/users/wishlist             // Get wishlist
POST   /api/users/wishlist/:productId  // Add to wishlist
DELETE /api/users/wishlist/:productId  // Remove from wishlist
```

---

## 👤 TASK 5.1: Create Profile Page (1 hour)

### File: `src/pages/Profile.jsx`

Main user profile dashboard showing:
- User information
- Quick stats (orders, wishlist items)
- Recent orders
- Quick actions (Edit Profile, Addresses, Wishlist)

---

## ✏️ TASK 5.2: Create Edit Profile Page (45 minutes)

### File: `src/pages/EditProfile.jsx`

Form to update:
- First Name / Last Name
- Email (read-only)
- Phone Number
- Password change option

---

## 📍 TASK 5.3: Create Address Book Page (1 hour)

### File: `src/pages/AddressBook.jsx`

Manage addresses:
- List all saved addresses
- Add new address
- Edit existing address
- Delete address
- Set default address
- Address cards with actions

---

## ❤️ TASK 5.4: Create Wishlist Page (1 hour)

### File: `src/pages/Wishlist.jsx`

Display wishlist:
- Grid of wishlisted products
- Product cards with images
- Remove from wishlist button
- Add to cart button
- Empty state
- Quick view option

---

## 🔌 TASK 5.5: Update Routes (15 minutes)

### File: `src/App.jsx`

Add profile routes:
```javascript
<Route path="/profile" element={<Profile />} />
<Route path="/profile/edit" element={<EditProfile />} />
<Route path="/profile/addresses" element={<AddressBook />} />
<Route path="/wishlist" element={<Wishlist />} />
```

---

## 🎯 DETAILED IMPLEMENTATION

## TASK 5.1: Profile Page

```javascript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService, orderService } from '../services';

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    addressCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
        orderService.getOrders(),
        userService.getWishlist(),
        userService.getAddresses(),
      ]);

      setStats({
        totalOrders: ordersRes.data.length,
        wishlistCount: wishlistRes.data.length,
        addressCount: addressesRes.data.length,
      });

      setRecentOrders(ordersRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Component JSX with stats cards, recent orders, quick actions
}
```

**Features:**
- User info card with avatar
- Stats cards (Orders, Wishlist, Addresses)
- Recent orders list
- Quick action buttons
- Logout button

---

## TASK 5.2: Edit Profile Page

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await userService.updateProfile(updateData);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Form JSX
}
```

**Features:**
- Edit name and phone
- Change password section
- Form validation
- Success/error messages
- Cancel button

---

## TASK 5.3: Address Book Page

```javascript
import { useEffect, useState } from 'react';
import { userService } from '../services';

function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setAddresses(response.data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, formData);
      } else {
        await userService.addAddress(formData);
      }
      
      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this address?')) {
      try {
        await userService.deleteAddress(id);
        await loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await userService.setDefaultAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  // JSX with address list and form
}
```

**Features:**
- Address cards with actions
- Add new address form
- Edit address inline
- Delete with confirmation
- Set default address
- Empty state

---

## TASK 5.4: Wishlist Page

```javascript
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
      setWishlist(response.data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await userService.removeFromWishlist(productId);
      await loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      // Find first available variant
      const variant = product.variants.find(v => v.stock > 0);
      
      if (!variant) {
        alert('Product is out of stock');
        return;
      }

      await cartService.addToCart({
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
      });

      await refreshCart();
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // JSX with product grid
}
```

**Features:**
- Product grid layout
- Product images
- Price display
- Remove button
- Add to cart button
- Stock status
- Empty wishlist state
- Link to shop

---

## ✅ TESTING CHECKLIST (Feature 5)

### 1. Profile Page:
- [ ] Navigate to /profile
- [ ] User info displays correctly
- [ ] Stats show correct counts
- [ ] Recent orders display
- [ ] Quick action buttons work
- [ ] Logout button works

### 2. Edit Profile:
- [ ] Navigate to /profile/edit
- [ ] Form pre-fills with current data
- [ ] Can update name and phone
- [ ] Password change section works
- [ ] Validation works
- [ ] Success message shows
- [ ] Redirects after save

### 3. Address Book:
- [ ] Navigate to /profile/addresses
- [ ] All addresses display
- [ ] Can add new address
- [ ] Form validation works
- [ ] Can edit address
- [ ] Can delete address
- [ ] Can set default address
- [ ] Default badge shows

### 4. Wishlist:
- [ ] Navigate to /wishlist
- [ ] All wishlisted products show
- [ ] Can remove from wishlist
- [ ] Can add to cart
- [ ] Stock status shows
- [ ] Price displays
- [ ] Empty state works
- [ ] Links to products work

### 5. Integration:
- [ ] Wishlist icon in header shows count
- [ ] Profile link in header works
- [ ] All navigation works
- [ ] Data persists after refresh

---

## 🎯 SUCCESS CRITERIA

✅ **Complete when:**
1. Users can view their profile
2. Users can edit profile info
3. Users can change password
4. Users can manage addresses (CRUD)
5. Users can add/remove wishlist items
6. Users can add wishlist items to cart
7. All pages have proper navigation

---

## 🐛 TROUBLESHOOTING

### Issue: "User not found"
**Solution:** 
- Verify user is logged in
- Check authentication token
- Check backend user endpoint

### Issue: "Cannot update profile"
**Solution:**
- Check all required fields filled
- Verify password if changing
- Check backend logs

### Issue: Wishlist not updating
**Solution:**
- Verify product ID is correct
- Check backend wishlist endpoint
- Refresh wishlist after action

### Issue: Address not saving
**Solution:**
- Check all required fields
- Verify address format
- Check backend validation

---

## 📝 NEXT STEPS

After completing Feature 5, you'll have:
- ✅ Complete user profile system
- ✅ Address management
- ✅ Wishlist functionality
- ✅ Profile editing

**Next:** Feature 6 - Reviews System

---

## 💡 TIPS

1. **Test CRUD operations** - Create, Read, Update, Delete for addresses
2. **Check wishlist sync** - Add/remove should update immediately
3. **Verify profile updates** - Changes should persist
4. **Test validation** - Required fields, email format, phone format
5. **Mobile responsive** - Test on different screen sizes

---

**Start with Task 5.1: Profile Page!** 🚀
