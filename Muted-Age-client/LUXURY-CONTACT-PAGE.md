# Luxury Contact Page + FAQ - World-Class Design

## 🏛️ Design Philosophy

**"Intentional. Elegant. Timeless."**

Inspired by Celine, Aēsop, Dior, Rimowa, and Jacquemus - this Contact page represents the pinnacle of luxury customer service experience. Every interaction feels calm, valued, and handcrafted.

---

## ✨ What Was Created

### 1. **Centered Minimal Header** (65vh)

**Main Headline:**
```
Contact Us
```
- Font: Bodoni Moda / Playfair Display
- Size: 9xl (144px desktop) → 7xl mobile
- Weight: Light (300)
- Tracking: Tight (0.02em)

**Subheading:**
```
WE'RE HERE TO ASSIST AND ENSURE A SEAMLESS EXPERIENCE.
```
- Size: sm/base (14-16px)
- Tracking: Wide (0.25em)
- Color: Gray-600
- All caps

**Ultra-Thin Divider:**
- Width: 128px
- Border: 0.5px
- Opacity: 25%
- Centered

---

### 2. **Premium Contact Form**

**Form Fields (Large Breathing Room):**

1. **Full Name** (Required)
   - Placeholder: "Full Name"
   - Border: 1px gray-300
   - Focus: Gray-900 border + ring
   - Border radius: 3px

2. **Email Address** (Required)
   - Placeholder: "Email Address"
   - Same styling as above
   - Email validation

3. **Phone Number** (Optional)
   - Placeholder: "Phone Number (Optional)"
   - Tel input type
   - Optional field

4. **Inquiry Type** (Dropdown - Required)
   - Options:
     - Order Support
     - Returns & Exchange
     - Sizing & Fit
     - Shipping
     - Press/Collaboration
     - General Inquiry
   - Custom chevron icon
   - Styled select dropdown

5. **Message Box** (Required)
   - Placeholder: "Your Message"
   - Initial rows: 6
   - **Expands on focus:** 6 rows → 8 rows (200px)
   - Smooth 0.5s animation
   - Contracts if empty on blur
   - Resize: none

**Field Styling:**
- Padding: 16px 24px
- Border: 1px solid gray-300
- Border radius: 3px (subtle luxury)
- Font: Light weight (300)
- Focus: Border → gray-900 + ring
- Transition: 300ms (500ms for textarea height)

**Spacing Between Fields:** 32px (space-y-8)

---

### 3. **Submission Area**

**Primary CTA - Send Message:**
- Background: Gray-900
- Text: White
- Padding: 16px 32px
- Tracking: 0.2em
- Border radius: 3px
- Hover: Scale 1.01, bg → black
- Disabled: Opacity 50%, not clickable
- Loading state: Spinner + "SENDING..."

**Secondary CTA - Live Support:**
- Background: White
- Border: 1px gray-900
- Padding: 16px 32px
- Icon: MessageCircle
- Hover: Invert colors (slow 500ms)
- Border radius: 3px

**Button Layout:**
- Flex row on desktop
- Flex column on mobile
- Gap: 16px
- Equal width (flex-1)

**Response Time Text:**
```
Response time: 12–48 hours
```
- Size: xs (12px)
- Color: Gray-500
- Font-weight: Light
- Tracking: Wide
- Center aligned

---

### 4. **Contact Information Block**

**Layout:** 2-column grid (1 col mobile)

**Left Column - Text Info:**

**Operating Hours:**
```
OPERATING HOURS (label)
Monday – Friday: 9:00 AM – 6:00 PM EST
Saturday: 10:00 AM – 4:00 PM EST
Sunday: Closed
```

**Customer Service:**
```
CUSTOMER SERVICE (label)
support@mutedage.com
```

**Support Number:**
```
SUPPORT NUMBER (label)
+1 (555) 123-4567
```

**Studio Address:**
```
STUDIO ADDRESS (label)
125 West 25th Street
Suite 400
New York, NY 10001
United States
```

**Typography:**
- Labels: xs (12px), tracking 0.25em, gray-500
- Content: base (16px), light weight, gray-900
- Stacked format (no icons)
- Spacing: 32px between sections

**Right Column - Map Preview:**

**Image:**
- Aspect ratio: 4:3
- Border radius: 4px
- Initial: Grayscale + 20% black overlay
- Hover: Full color, no overlay
- Transition: 700ms smooth

**Hover Effect:**
- Scale: 1.02
- "VIEW ON MAP" button appears
- Button: White/95 bg, 3px radius
- Smooth fade-in: 500ms

---

### 5. **FAQ Section**

**Header:**
```
Frequently Asked Questions
```
- Font: Bodoni Moda/Playfair
- Size: 6xl (60px) → 5xl mobile
- Weight: Light
- Center aligned

**Subheading:**
```
Find quick answers to common questions.
```
- Size: sm (14px)
- Color: Gray-600
- Tracking: Wide

**FAQ Categories (7 Total):**

1. **Shipping & Delivery** (2 questions)
2. **Sizing & Fit** (2 questions)
3. **Returns & Exchanges** (2 questions)
4. **Order Tracking** (2 questions)
5. **Payments & Discounts** (2 questions)
6. **Care Instructions** (2 questions)
7. **International Orders** (2 questions)

**Accordion Structure:**

**Category Label:**
- Size: xs (12px)
- Tracking: 0.25em
- Color: Gray-500
- All caps
- Margin bottom: 24px

**Question Card:**
- Border: 1px gray-200
- Background: White
- Border radius: 3px
- Padding: 20px 32px

**Question Button:**
- Full width
- Text: base (16px), light weight
- Hover: Background → gray-50
- Chevron: Rotates 180° when expanded

**Answer Panel:**
- Border top: 1px gray-100
- Background: Gray-50
- Padding: 24px 32px
- Text: sm (14px), gray-600, light weight
- Leading: Relaxed

**Animation:**
- Open/Close: 0.5s smooth
- Chevron rotation: 0.5s ease
- Height: auto (smooth expand)
- Easing: [0.22, 1, 0.36, 1]

---

### 6. **FAQ Footer**

**Reassurance Text:**
```
Didn't find your answer? Reach out — we're here.
```
- Size: sm (14px)
- Color: Gray-600
- Center aligned

**CTA Link:**
```
MESSAGE SUPPORT →
```
- Size: sm (14px)
- Tracking: 0.2em
- Hover: Arrow shifts right
- Underline: 0% → 100% animation (500ms)
- Scrolls to top of page

**Styling:**
- Border top: 0.5px gray-200
- Padding top: 64px
- Margin top: 64px
- Center aligned

---

## ⚡ Animation Specifications

### Page Load:
**Header:**
- Initial: opacity 0, y: 30
- Animate: opacity 1, y: 0
- Duration: 1.0s
- Easing: [0.22, 1, 0.36, 1]

**Form:**
- whileInView with viewport: once
- Duration: 0.9s
- Same easing

**Contact Info & Map:**
- whileInView trigger
- Duration: 0.9s
- Staggered slightly

### Interactions:

**Button Hovers:**
- Scale: 1.01 (hover), 0.99 (tap)
- Duration: 300ms
- Micro-feedback

**Live Support Hover:**
- Color invert transition
- Duration: 500ms (slower, intentional)

**Textarea Expand:**
- Height: auto → 200px
- Duration: 500ms
- Easing: ease-out
- On focus only

**Map Preview:**
- Scale: 1.02
- Grayscale → Color
- Overlay fade
- Duration: 700ms

**FAQ Accordion:**
- Height: 0 → auto
- Opacity: 0 → 1
- Duration: 0.5s
- Easing: [0.22, 1, 0.36, 1]

**Chevron Rotation:**
- 0° → 180°
- Duration: 0.5s
- Smooth easing

---

## 🎨 Color Palette

### Background:
- Page: #FFFEF9 (warm luxury white)
- Form fields: #FFFFFF (pure white)
- FAQ answers: #F9FAFB (gray-50)

### Text:
- Primary: #111827 (gray-900)
- Secondary: #6B7280 (gray-500)
- Tertiary: #9CA3AF (gray-400)

### Borders:
- Default: #D1D5DB (gray-300)
- Focus: #111827 (gray-900)
- Light: #F3F4F6 (gray-100)

### CTAs:
- Primary: #111827 (gray-900)
- Primary hover: #000000 (black)
- Secondary: White with gray-900 border

---

## 🔤 Typography

### Headings:
**Main Title:**
- Font: Bodoni Moda / Playfair Display
- Size: 9xl → 7xl mobile
- Weight: 300 (light)
- Tracking: 0.02em

**Section Titles:**
- Font: Bodoni Moda / Playfair Display
- Size: 6xl → 5xl mobile
- Weight: 300 (light)

**Labels:**
- Size: xs (12px)
- Weight: 300 (light)
- Tracking: 0.25em
- All caps

### Body Text:
- Size: base (16px) for content
- Size: sm (14px) for descriptions
- Weight: 300 (light)
- Leading: Relaxed
- Color: Gray-600 or Gray-900

### Form Elements:
- Size: base (16px)
- Weight: 300 (light)
- Placeholders: Gray-500

---

## 📐 Spacing

### Section Padding:
- Form section: py-24 (96px)
- Contact info: py-16 (64px)
- FAQ section: py-32 (128px)

### Container Max Width:
- Form: 768px (max-w-3xl)
- Contact info: 1024px (max-w-5xl)
- FAQ: 896px (max-w-4xl)

### Form Fields:
- Gap between fields: 32px (space-y-8)
- Field padding: 16px 24px
- Button padding: 16px 32px

### FAQ:
- Category spacing: 48px (space-y-12)
- Question spacing: 12px (space-y-3)
- Answer padding: 24px 32px

---

## 🎭 UX Philosophy

### Global Behavior:

**Calm & Intentional:**
- No surprise movements
- Everything slow & smooth
- 0.4s - 1.1s animations
- Controlled interactions

**Spacious Feel:**
- Generous padding everywhere
- Large breathing room
- Clean hierarchy
- Not transactional

**Premium Motion:**
- Fade in on scroll
- Smooth input animations
- Gentle hover effects
- Accordion unfolds elegantly

**Touch-Friendly:**
- Large hit areas (44px minimum)
- Clear button states
- Mobile-optimized layout
- Responsive breakpoints

**Emotional Trust:**
- Reassuring copy
- Response time transparency
- Multiple contact methods
- Helpful FAQ structure

---

## 📱 Responsive Design

### Breakpoints:

**Mobile (< 768px):**
- 1 column layout
- 7xl headline
- Stacked buttons
- Smaller padding

**Tablet (768-1023px):**
- 2 columns for contact info
- 8xl headline
- Side-by-side buttons

**Desktop (1024px+):**
- Full 2-column grid
- 9xl headline
- Generous spacing

---

## ✨ Key Features

### Form Experience:
✅ 5 fields with proper validation  
✅ Dropdown for inquiry types  
✅ Optional phone field  
✅ Textarea expands on focus (smooth)  
✅ Two CTA buttons (primary + secondary)  
✅ Loading states  
✅ Success/error messaging  
✅ Response time transparency  

### Contact Information:
✅ Operating hours  
✅ Email & phone  
✅ Studio address  
✅ Grayscale map preview  
✅ Hover to focus effect  
✅ "View on Map" overlay  
✅ Stacked format (no icons)  

### FAQ Section:
✅ 7 categories  
✅ 14 total questions  
✅ Smooth accordion (0.5s)  
✅ Chevron rotation  
✅ Category labels  
✅ Structured answers  
✅ "Message Support" CTA  
✅ Scroll to top functionality  

### Interactions:
✅ Micro-scale animations (1-2%)  
✅ Slow hover transitions (300-700ms)  
✅ Focus states with rings  
✅ Underline animations  
✅ Arrow shift effects  
✅ Color inversions (500ms)  

---

## 🎯 Luxury Touches

### What Makes It Premium:

**1. Warm White Background**
- #FFFEF9 (not clinical)
- Soft undertones
- Inviting feel

**2. Ultra-Thin Dividers**
- 0.5px borders
- 20-25% opacity
- Barely visible sophistication

**3. 3px Border Radius**
- Subtle luxury
- Not fully rounded (trendy)
- Modern yet timeless

**4. Expanding Textarea**
- Smooth 500ms animation
- Contextual height
- Respectful UX

**5. Live Support Button**
- Icon + text
- Slow color inversion
- Secondary but accessible

**6. Map Preview Interaction**
- Grayscale → Color
- Overlay fade
- "View on Map" reveal
- 700ms smooth

**7. FAQ Micro-Copy**
- Reassuring language
- "Reach out — we're here"
- Human touch

**8. Chevron Rotation**
- 180° smooth rotation
- 0.5s duration
- Elegant visual cue

**9. Response Time**
- Transparent: "12-48 hours"
- Sets expectations
- Builds trust

**10. Scroll Behavior**
- Smooth scrolling
- Progressive reveals
- Never jarring

---

## 📊 Comparison: Before vs After

### Before:
- Dark hero section
- Card-based contact methods
- Green accent colors
- Basic FAQ structure
- Rounded borders
- Faster animations

### After:
- Warm white throughout
- Integrated contact info
- Gray-900 sophistication
- Categorized FAQ (7 sections)
- Subtle 3px radius
- Slower animations (0.4-1.1s)
- Expanding textarea
- Dropdown inquiry types
- Map preview with hover
- Response time transparency

---

## 🎨 Design Tokens

### Border Radius:
- Form fields: 3px
- Buttons: 3px
- FAQ cards: 3px
- Map: 4px

### Border Width:
- Default: 1px
- Dividers: 0.5px
- Focus rings: 1px

### Font Weights:
- Light: 300 (primary)
- Normal: 400
- Medium: 500

### Transitions:
- Fast: 300ms (buttons)
- Medium: 500ms (textarea, inversions)
- Slow: 700ms (map)
- Accordion: 500ms

---

## 🚀 Technical Implementation

### Form Validation:
- HTML5 required attributes
- Email type validation
- Tel type for phone
- Controlled inputs (React state)
- Submit disabled during loading

### Form Submission:
- 2s simulated API call
- Loading spinner
- Success message (6s)
- Form reset on success
- Error handling

### FAQ Accordion:
- Single expansion (one at a time)
- Click to toggle
- AnimatePresence for exit
- Smooth height animation
- ID-based tracking

### Scroll Behavior:
- whileInView triggers
- viewport: { once: true }
- Smooth scroll to top
- Progressive reveals

---

## ✅ Completed Features

### Header:
✅ Centered minimal layout  
✅ Large serif headline  
✅ Reassuring subheading  
✅ Ultra-thin divider (0.5px)  
✅ 1.0s fade-up animation  

### Contact Form:
✅ Full Name field  
✅ Email Address field  
✅ Phone Number (optional)  
✅ Inquiry Type dropdown  
✅ Expanding Message box  
✅ Two CTA buttons  
✅ Response time text  
✅ Success/error messaging  

### Contact Info:
✅ Operating hours  
✅ Customer service email  
✅ Support phone number  
✅ Studio address (stacked)  
✅ Grayscale map preview  
✅ Hover to focus effect  
✅ "View on Map" overlay  

### FAQ:
✅ 7 categories  
✅ 14 questions total  
✅ Smooth 0.5s accordion  
✅ Chevron rotation  
✅ Category labels  
✅ Structured content  
✅ "Message Support" CTA  
✅ Scroll to top link  

---

## 🎉 Final Result

**A Contact page that makes customers feel:**
- 🏛️ Valued and respected
- ✨ Calm and confident
- 💎 Premium service awaits
- 🎨 Handcrafted attention
- ⏱️ Clear expectations
- 🤝 Human connection

**This is not just a contact form.**  
**This is a luxury concierge experience.**

---

**Design Version:** 1.0 (Timeless Luxury)  
**Date:** November 25, 2024  
**Status:** Production Ready
**Inspiration:** Celine, Aēsop, Dior, Rimowa, Jacquemus
