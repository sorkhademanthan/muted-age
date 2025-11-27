# Feature 6: Reviews System Integration

**Goal:** Complete product review and rating system

**Time:** 4 hours  
**Priority:** Medium  
**Dependencies:** Authentication ✅, Products ✅, Orders ✅

---

## 📋 Overview

### What We'll Build:
1. **Write Review Page** - Submit reviews for purchased products
2. **My Reviews Page** - View and manage user's reviews
3. **Product Reviews Component** - Display reviews on product pages
4. **Review Stats** - Star ratings and review counts

### Backend Endpoints We'll Use:
```javascript
POST   /api/reviews                    // Create review
GET    /api/reviews/user               // Get user's reviews
GET    /api/reviews/product/:productId // Get product reviews
PUT    /api/reviews/:id                // Update review
DELETE /api/reviews/:id                // Delete review
POST   /api/reviews/:id/helpful        // Mark review helpful
```

---

## ⭐ TASK 6.1: Create Write Review Page (1 hour)

### File: `src/pages/WriteReview.jsx`

Features:
- Select product from order
- Star rating selector (1-5 stars)
- Review title
- Review text
- Image upload (optional)
- Recommend product checkbox
- Submit button

---

## 📝 TASK 6.2: Create My Reviews Page (1 hour)

### File: `src/pages/Reviews.jsx`

Features:
- List all user reviews
- Star ratings display
- Edit review button
- Delete review button
- Product info
- Date posted
- Helpful count
- Empty state

---

## 💬 TASK 6.3: Create Product Reviews Component (1.5 hours)

### File: `src/components/ProductReviews.jsx`

Features:
- Review summary (avg rating, total count)
- Star distribution chart
- Filter/sort reviews
- Individual review cards
- Helpful button
- Verified purchase badge
- Load more button

---

## 🔌 TASK 6.4: Update Routes (30 minutes)

### File: `src/App.jsx`

Add review routes and integrate component into product pages

---

## 🎯 DETAILED IMPLEMENTATION

## TASK 6.1: Write Review Page

```javascript
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: true,
  });
  
  const [hoveredRating, setHoveredRating] = useState(0);

  // Load order and product info
  useEffect(() => {
    loadOrderProduct();
  }, [orderId, productId]);

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      await reviewService.createReview({
        product: productId,
        order: orderId,
        ...formData,
      });
      
      alert('Review submitted successfully!');
      navigate('/reviews');
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // JSX with star rating, form fields
}
```

**Features:**
- Interactive star rating
- Title and comment fields
- Recommend checkbox
- Product preview
- Form validation
- Success redirect

---

## TASK 6.2: My Reviews Page

```javascript
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
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        await loadReviews();
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  // JSX with review list
}
```

**Features:**
- Review cards with star ratings
- Product information
- Edit/delete buttons
- Helpful count
- Date display
- Empty state

---

## TASK 6.3: Product Reviews Component

```javascript
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

  useEffect(() => {
    loadReviews();
  }, [productId, sortBy]);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getProductReviews(productId, { sortBy });
      setReviews(response.data.reviews);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      await loadReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  // JSX with review summary, filters, review cards
}
```

**Features:**
- Review summary with avg rating
- Star distribution chart
- Sort options (recent, helpful, rating)
- Individual review cards
- Helpful button
- Verified purchase badge
- Pagination/load more

---

## ✅ TESTING CHECKLIST (Feature 6)

### 1. Write Review:
- [ ] Navigate from order details
- [ ] Product info displays
- [ ] Star rating works (click and hover)
- [ ] Can enter title and comment
- [ ] Recommend checkbox works
- [ ] Form validation works
- [ ] Submit creates review
- [ ] Redirects after submit

### 2. My Reviews:
- [ ] Navigate to /reviews
- [ ] All reviews display
- [ ] Star ratings show correctly
- [ ] Product info displays
- [ ] Can edit review
- [ ] Can delete review (with confirmation)
- [ ] Helpful count shows
- [ ] Date displays
- [ ] Empty state works

### 3. Product Reviews:
- [ ] Reviews show on product page
- [ ] Average rating displays
- [ ] Total count correct
- [ ] Star distribution shows
- [ ] Can sort reviews
- [ ] Can filter reviews
- [ ] Helpful button works
- [ ] Verified badge shows
- [ ] Load more works

### 4. Integration:
- [ ] "Write Review" link in order details works
- [ ] Review count updates after submit
- [ ] Average rating updates
- [ ] Cannot review without purchase
- [ ] Cannot review same product twice

---

## 🎯 SUCCESS CRITERIA

✅ **Complete when:**
1. Users can write reviews for purchased products
2. Users can view/edit/delete their reviews
3. Product pages display reviews
4. Star ratings work correctly
5. Review stats calculate properly
6. Helpful voting works
7. Sorting/filtering works

---

## 🐛 TROUBLESHOOTING

### Issue: Cannot submit review
**Solution:** 
- Verify product was purchased
- Check if already reviewed
- Verify all required fields
- Check backend validation

### Issue: Reviews not displaying
**Solution:**
- Check productId is correct
- Verify backend endpoint
- Check console for errors
- Verify reviews exist

### Issue: Star rating not working
**Solution:**
- Check click/hover handlers
- Verify state updates
- Check CSS for star display

### Issue: Helpful button not working
**Solution:**
- Verify user is authenticated
- Check backend endpoint
- Cannot mark own review helpful

---

## 📝 NEXT STEPS

After completing Feature 6, you'll have:
- ✅ Complete review system
- ✅ Star ratings
- ✅ Review management
- ✅ Product review display

**Next:** Feature 7 - Support System

---

## 💡 TIPS

1. **Test review flow** - Order → Write Review → View Review
2. **Check ratings** - Verify calculations
3. **Test voting** - Mark reviews helpful
4. **Verify badges** - Verified purchase shows
5. **Mobile responsive** - Test on all screens

---

**Start with Task 6.1: Write Review Page!** 🚀
