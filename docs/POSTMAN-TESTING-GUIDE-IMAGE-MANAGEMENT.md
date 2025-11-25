# Postman Testing Guide - Image Management API

## 📋 Prerequisites
- Postman installed
- Server running on `http://localhost:5000`
- Sample images ready for testing

---

## 🚀 Step-by-Step Testing Guide

### STEP 1: Start the Server

```bash
cd Muted-Age-server
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

---

### STEP 2: Get Admin Bearer Token

#### Option A: Login with Existing Admin Account (If you have one)

**Request:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**📌 COPY THE TOKEN** - You'll need it for all subsequent requests!

---

#### Option B: Register New Admin Account (If needed)

> **Note:** By default, registration creates a 'user' role. You'll need to manually update the database to make a user an admin.

**Step B1: Register Regular User**

- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "username": "testadmin",
    "email": "testadmin@example.com",
    "password": "admin123456"
  }
  ```

**Step B2: Make User Admin (MongoDB Compass or CLI)**

Using MongoDB CLI:
```bash
# Connect to MongoDB
mongosh

# Use your database
use muted-age-dev

# Update user role to admin
db.users.updateOne(
  { email: "testadmin@example.com" },
  { $set: { role: "admin" } }
)
```

Using MongoDB Compass:
1. Connect to your database
2. Find the `users` collection
3. Find your user by email
4. Edit the `role` field to `"admin"`
5. Save

**Step B3: Login with Admin Account**
- Follow Option A to login and get the token

---
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjE1OWUxY2NhYzJlYzNhMTk1ZmQwMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDA1Njk3NCwiZXhwIjoxNzY0MTQzMzc0fQ.AsJwKRVcrtZ1cIIDb0P5M4cTJRYq6KzWicLaI9Mi5ag

69215bf0f4a335fbc18c8c59
### STEP 3: Get a Product ID

**Request:**
- **Method:** GET
- **URL:** `http://localhost:5000/api/products`
- **Headers:** (None required for public endpoint)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "673c1234567890abcdef1234",  // ← COPY THIS
        "name": "Classic T-Shirt",
        "images": []
      }
    ]
  }
}
```

**📌 COPY A PRODUCT ID** - You'll use this for image operations

**If no products exist**, create one:
- **Method:** POST
- **URL:** `http://localhost:5000/api/products`
- **Headers:**
  ```
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Test Product",
    "slug": "test-product",
    "description": "Product for testing images",
    "price": 29.99,
    "category": "Clothing",
    "brand": "Muted Age",
    "variants": [
      {
        "size": "M",
        "color": "Black",
        "sku": "TEST-M-BLK",
        "stock": 10,
        "price": 29.99
      }
    ]
  }
  ```

---

### STEP 4: Test Image Upload

**Prepare:**
- Have 1-3 test images ready (JPEG, PNG, or WebP)
- Maximum 5MB per file
- Recommended size: 800x800 to 1200x1200 pixels

**Request:**
- **Method:** POST
- **URL:** `http://localhost:5000/api/products/YOUR_PRODUCT_ID_HERE/images`
  - Replace `YOUR_PRODUCT_ID_HERE` with actual product ID
  - Example: `http://localhost:5000/api/products/673c1234567890abcdef1234/images`

- **Headers:**
  ```
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  ```
  ⚠️ **DO NOT add** `Content-Type` header (Postman will auto-set for form-data)

- **Body:**
  1. Select **"form-data"** (NOT raw, NOT binary)
  2. Add fields:
     - **Key:** `images` | **Type:** File (dropdown) | **Value:** Click "Select Files" and choose 1-3 images
     - **Key:** `markPrimary` | **Type:** Text | **Value:** `true`
     - **Key:** `alt` | **Type:** Text | **Value:** `Test product image`

**Postman Screenshot Setup:**
```
┌─────────────────────────────────────────────┐
│ KEY          │ VALUE                        │
├─────────────────────────────────────────────┤
│ images (File)│ [📁 image1.jpg]             │
│ images (File)│ [📁 image2.jpg]             │
│ markPrimary  │ true                         │
│ alt          │ Test product image           │
└─────────────────────────────────────────────┘
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "2 image(s) uploaded successfully",
  "data": {
    "product": {
      "_id": "673c1234567890abcdef1234",
      "name": "Test Product",
      "images": [
        {
          "_id": "673c5678901234abcdef5678",  // ← COPY THIS IMAGE ID
          "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/muted-age/products/xyz.jpg",
          "publicId": "muted-age/products/xyz",
          "alt": "Test product image",
          "isPrimary": true
        },
        {
          "_id": "673c5678901234abcdef5679",
          "url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/muted-age/products/abc.jpg",
          "publicId": "muted-age/products/abc",
          "alt": "Test product image",
          "isPrimary": false
        }
      ]
    },
    "uploadedCount": 2
  }
}
```

**📌 COPY AN IMAGE ID** - You'll need it for update/delete operations

---

### STEP 5: Test Update Image - Change Alt Text

**Request:**
- **Method:** PUT
- **URL:** `http://localhost:5000/api/products/YOUR_PRODUCT_ID/images/YOUR_IMAGE_ID`
  - Replace both IDs with actual values
  - Example: `http://localhost:5000/api/products/673c1234567890abcdef1234/images/673c5678901234abcdef5678`

- **Headers:**
  ```
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  Content-Type: application/json
  ```

- **Body (raw JSON):**
  ```json
  {
    "alt": "Updated product image description"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "_id": "673c1234567890abcdef1234",
    "images": [
      {
        "_id": "673c5678901234abcdef5678",
        "alt": "Updated product image description",  // ← Changed!
        "isPrimary": true
      }
    ]
  }
}
```

---

### STEP 6: Test Set Image as Primary

**Request:**
- **Method:** PUT
- **URL:** `http://localhost:5000/api/products/YOUR_PRODUCT_ID/images/SECOND_IMAGE_ID`
  - Use a DIFFERENT image ID (not the current primary)

- **Headers:**
  ```
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  Content-Type: application/json
  ```

- **Body (raw JSON):**
  ```json
  {
    "isPrimary": true
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "images": [
      {
        "_id": "673c5678901234abcdef5678",
        "isPrimary": false  // ← Old primary now false
      },
      {
        "_id": "673c5678901234abcdef5679",
        "isPrimary": true   // ← New primary!
      }
    ]
  }
}
```

---

### STEP 7: Test Delete Image

**Request:**
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/products/YOUR_PRODUCT_ID/images/YOUR_IMAGE_ID`

- **Headers:**
  ```
  Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
  ```

- **Body:** (None - leave empty)

**Expected Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "_id": "673c1234567890abcdef1234",
    "images": [
      // Deleted image is removed from array
      // If deleted image was primary, first remaining image is now primary
    ]
  }
}
```

---

## 🧪 Error Testing Scenarios

### Test 1: Upload Without Authentication
- **Setup:** Remove Authorization header
- **Expected:** 401 Unauthorized

### Test 2: Upload Invalid File Type
- **Setup:** Try uploading a PDF or TXT file
- **Expected:** 400 Bad Request - "Invalid file type"

### Test 3: Upload Too Large File
- **Setup:** Try uploading image > 5MB
- **Expected:** 400 Bad Request - "File too large"

### Test 4: Update Non-existent Image
- **Setup:** Use fake image ID like `000000000000000000000000`
- **Expected:** 404 Not Found - "Image not found"

### Test 5: Access as Regular User
- **Setup:** Login as regular user (non-admin), try to upload
- **Expected:** 403 Forbidden

---

## 📝 Postman Collection Structure

You can organize your requests like this:

```
Muted Age API
├── 🔐 Authentication
│   ├── Register User
│   ├── Login (Admin)
│   └── Get Current User
├── 📦 Products
│   ├── Get All Products
│   ├── Get Product by ID
│   └── Create Product
└── 🖼️ Image Management
    ├── Upload Images
    ├── Update Image Alt Text
    ├── Set Image as Primary
    ├── Delete Image
    └── 🚫 Error Tests
        ├── Upload Without Auth
        ├── Invalid File Type
        └── Non-existent Image
```

---

## 🎯 Quick Reference - Request Templates

### Upload Images Template
```
POST http://localhost:5000/api/products/{productId}/images
Authorization: Bearer {token}
Body: form-data
  - images: [File]
  - markPrimary: true
  - alt: "Product image"
```

### Update Image Template
```
PUT http://localhost:5000/api/products/{productId}/images/{imageId}
Authorization: Bearer {token}
Content-Type: application/json
Body: {"alt": "New text", "isPrimary": true}
```

### Delete Image Template
```
DELETE http://localhost:5000/api/products/{productId}/images/{imageId}
Authorization: Bearer {token}
```

---

## 💡 Pro Tips

### Tip 1: Save Token as Environment Variable
1. In Postman, click "Environments" (top right)
2. Create new environment: "Muted Age Dev"
3. Add variable:
   - Variable: `admin_token`
   - Initial Value: (paste your token)
   - Current Value: (same token)
4. In requests, use: `{{admin_token}}`

### Tip 2: Save Product ID as Variable
- Variable: `test_product_id`
- Use: `http://localhost:5000/api/products/{{test_product_id}}/images`

### Tip 3: Use Postman Tests to Auto-Save IDs
Add this to the "Tests" tab of your login request:
```javascript
var jsonData = pm.response.json();
pm.environment.set("admin_token", jsonData.data.token);
```

### Tip 4: Check Cloudinary Dashboard
- Login to your Cloudinary account
- Go to Media Library
- Check `muted-age/products` folder
- Verify images are uploaded and deleted correctly

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error
**Solution:**
- Check token is copied correctly
- Ensure no extra spaces in Authorization header
- Verify token hasn't expired (default: 1 hour)
- Re-login to get fresh token

### Issue: "Forbidden" Error
**Solution:**
- Check user role is "admin" in database
- Regular users cannot upload images

### Issue: "Failed to upload to Cloudinary"
**Solution:**
- Check `.env` file has correct Cloudinary credentials
- Verify Cloudinary account is active
- Check internet connection

### Issue: "Product not found"
**Solution:**
- Verify product ID is correct (24-character hex string)
- Check product exists: GET `/api/products/{id}`

### Issue: "No files uploaded"
**Solution:**
- Ensure Body type is "form-data" (not raw)
- Key name must be exactly "images" (plural)
- File type dropdown must be set to "File"

---

## ✅ Testing Checklist

Use this to track your testing progress:

- [ ] Server is running on port 5000
- [ ] Successfully logged in as admin
- [ ] Token is saved and working
- [ ] Got list of products
- [ ] Uploaded single image
- [ ] Uploaded multiple images (2-3)
- [ ] Verified images in response have `url` and `publicId`
- [ ] Updated image alt text
- [ ] Set different image as primary
- [ ] Verified only one image is primary at a time
- [ ] Deleted an image
- [ ] Verified image was removed from Cloudinary
- [ ] Tested upload without authentication (should fail)
- [ ] Tested invalid file type (should fail)
- [ ] Checked product still has remaining images after deletion

---

## 🎉 Success Criteria

You've successfully tested everything when:
1. ✅ You can upload images and see them in the response with Cloudinary URLs
2. ✅ You can update alt text and primary status
3. ✅ You can delete images and they're removed from Cloudinary
4. ✅ Errors are handled properly (auth, validation)
5. ✅ Only one image is marked as primary at any time

---

**

Need help? Check the main documentation: `docs/chapter-2.4-image-management.md`
