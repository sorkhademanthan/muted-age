# Feature 7: Support System Integration

**Goal:** Complete customer support ticket system

**Time:** 4 hours  
**Priority:** Medium  
**Dependencies:** Authentication ✅

---

## 📋 Overview

### What We'll Build:
1. **Support Dashboard** - View all user tickets
2. **Create Ticket Page** - Submit new support requests
3. **Ticket Detail Page** - View ticket and reply to messages
4. **Ticket Categories** - Different support categories

### Backend Endpoints We'll Use:
```javascript
POST   /api/support                    // Create ticket
GET    /api/support                    // Get user's tickets
GET    /api/support/:id                // Get ticket details
POST   /api/support/:id/reply          // Reply to ticket
POST   /api/support/:id/reopen         // Reopen closed ticket
```

---

## 🎫 TASK 7.1: Create Support Dashboard (1 hour)

### File: `src/pages/Support.jsx`

Features:
- List all user tickets
- Filter by status (open, in-progress, resolved, closed)
- Ticket number display
- Subject and category
- Status badges
- Last updated time
- Create new ticket button
- Empty state

---

## ✍️ TASK 7.2: Create New Ticket Page (1 hour)

### File: `src/pages/CreateTicket.jsx`

Features:
- Category selection
- Priority selection
- Subject field
- Description field
- Order reference (optional)
- Form validation
- Submit button
- Guidelines display

---

## 💬 TASK 7.3: Create Ticket Detail Page (1.5 hours)

### File: `src/pages/TicketDetail.jsx`

Features:
- Ticket header with number and status
- Ticket details (category, priority, created date)
- Message thread (chronological)
- Reply form
- Reopen button (if closed)
- Status timeline
- Auto-scroll to latest message

---

## 🔌 TASK 7.4: Update Routes & Header (30 minutes)

### Files: `src/App.jsx`, `src/components/Header.jsx`

Add support routes and navigation

---

## 🎯 DETAILED IMPLEMENTATION

## TASK 7.1: Support Dashboard

```javascript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportService } from '../services';

function Support() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await supportService.getTickets(params);
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#2196F3',
      'in-progress': '#FF9800',
      resolved: '#4CAF50',
      closed: '#666',
    };
    return colors[status] || '#666';
  };

  // JSX with ticket list and filters
}
```

**Features:**
- Ticket cards with status badges
- Filter tabs (all, open, in-progress, resolved, closed)
- Ticket number (MUTED-YYYY-####)
- Subject and category
- Last message preview
- Created/updated date
- Click to view details

---

## TASK 7.2: Create Ticket Page

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../services';

function CreateTicket() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    orderReference: '',
  });

  const categories = [
    { value: 'order', label: 'Order Issue' },
    { value: 'product', label: 'Product Question' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'return', label: 'Return & Refund' },
    { value: 'account', label: 'Account & Login' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const response = await supportService.createTicket(formData);
      alert('Ticket created successfully!');
      navigate(`/support/${response.data._id}`);
    } catch (error) {
      alert('Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  // JSX with form fields
}
```

**Features:**
- Category dropdown
- Priority selection (low, medium, high, urgent)
- Subject field
- Description textarea
- Order reference (optional)
- Form validation
- Guidelines display

---

## TASK 7.3: Ticket Detail Page

```javascript
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supportService } from '../services';

function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const loadTicket = async () => {
    try {
      const response = await supportService.getTicket(ticketId);
      setTicket(response.data);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    try {
      setSubmitting(true);
      await supportService.replyToTicket(ticketId, { message: replyText });
      setReplyText('');
      await loadTicket();
    } catch (error) {
      alert('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async () => {
    try {
      await supportService.reopenTicket(ticketId);
      await loadTicket();
    } catch (error) {
      alert('Failed to reopen ticket');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // JSX with ticket details and message thread
}
```

**Features:**
- Ticket header with number and status
- Ticket info (category, priority, created date)
- Message thread (user and support replies)
- Message timestamps
- Reply form
- Reopen button (if closed/resolved)
- Auto-scroll to latest

---

## ✅ TESTING CHECKLIST (Feature 7)

### 1. Support Dashboard:
- [ ] Navigate to /support
- [ ] All tickets display
- [ ] Filter by status works
- [ ] Ticket cards show correct info
- [ ] Status badges correct colors
- [ ] Click ticket opens details
- [ ] Create ticket button works
- [ ] Empty state shows if no tickets

### 2. Create Ticket:
- [ ] Navigate to /support/new
- [ ] Category dropdown works
- [ ] Priority selection works
- [ ] Can enter subject and description
- [ ] Form validation works
- [ ] Submit creates ticket
- [ ] Redirects to ticket details
- [ ] Ticket number assigned

### 3. Ticket Detail:
- [ ] Navigate to ticket
- [ ] Ticket info displays correctly
- [ ] Status badge shows
- [ ] Message thread displays
- [ ] Can send reply
- [ ] Reply appears in thread
- [ ] Timestamps show
- [ ] Reopen button shows if closed
- [ ] Auto-scrolls to latest message

### 4. Integration:
- [ ] Support link in header works
- [ ] Can navigate between pages
- [ ] Back buttons work
- [ ] Ticket count updates

---

## 🎯 SUCCESS CRITERIA

✅ **Complete when:**
1. Users can create support tickets
2. Users can view all their tickets
3. Users can reply to tickets
4. Users can reopen closed tickets
5. Status badges work correctly
6. Message threading works
7. All navigation works

---

## 🐛 TROUBLESHOOTING

### Issue: Cannot create ticket
**Solution:** 
- Check all required fields
- Verify category is selected
- Check backend validation
- Verify authentication

### Issue: Messages not displaying
**Solution:**
- Check ticket ID in URL
- Verify backend endpoint
- Check message array structure
- Look at console for errors

### Issue: Reply not sending
**Solution:**
- Check message is not empty
- Verify ticket is not closed
- Check backend endpoint
- Verify authentication token

### Issue: Status colors wrong
**Solution:**
- Check status value from backend
- Verify getStatusColor mapping
- Check CSS is applied

---

## 📝 NEXT STEPS

After completing Feature 7, you'll have:
- ✅ Complete support ticket system
- ✅ Ticket creation and management
- ✅ Message threading
- ✅ Status tracking

**Next:** Testing all features together!

---

## 💡 TIPS

1. **Test ticket flow** - Create → Reply → Resolve → Reopen
2. **Check categories** - Verify all categories work
3. **Test priorities** - Check different priority levels
4. **Verify messages** - Check chronological order
5. **Mobile responsive** - Test on all screens

---

**Start with Task 7.1: Support Dashboard!** 🚀
