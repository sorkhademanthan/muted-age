# Chapter 2.4: Product Image Management

## Overview
Complete implementation of product image management features including upload, delete, and update operations with Cloudinary integration.

## 📦 Features Implemented

### 1. **Image Upload**
- Multiple image upload support (up to 10 images)
- Cloudinary integration for cloud storage
- Automatic image optimization (1000x1000, quality: auto)
- WebP format support
- Primary image marking
- Admin-only access

### 2. **Image Delete**
- Remove images from product
- Automatic Cloudinary cleanup
- Auto-reassign primary image if deleted
- Admin-only access

### 3. **Image Update**
- Update image alt text
- Set image as primary
- Metadata management
- Admin-only access

### 4. **Multer Configuration**
- Memory storage (no disk writes)
- File type validation (JPEG, PNG, WebP)
- 5MB file size limit
- Proper error handling

### 5. **Cloudinary Integration**
- Organized folder structure (muted-age/products)
- Image transformation and optimization
- Secure URL generation
- Public ID tracking for deletion

---

## 🗂️ File Structure

```
Muted-Age-server/
├── config/
│   └── multer.js              # Multer configuration
├── utils/
│   └── cloudinary.js          # Cloudinary helper functions
├── routes/
│   └── products.js            # Image management routes
├── models/
│   └── Product.js             # Updated with publicId field
└── test-chapter-2.4.sh        # Testing script
```

---

## 🔌 API Endpoints

### 1. Upload Images
**POST** `/api/products/:id/images`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
images: [File, File, ...]  (Max 10 files)
markPrimary: true/false    (Optional, marks first image as primary)
alt: string                (Optional, alt text for images)
```

**Response:**
```json
{
  "success": true,
  "message": "3 image(s) uploaded successfully",
  "data": {
    "product": {
      "_id": "...",
      "name": "Product Name",
      "images": [
        {
          "_id": "...",
          "url": "https://res.cloudinary.com/...",
          "publicId": "muted-age/products/...",
          "alt": "Product image",
          "isPrimary": true
        }
      ]
    },
    "uploadedCount": 3
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/products/<PRODUCT_ID>/images \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "markPrimary=true"
```

---

### 2. Delete Image
**DELETE** `/api/products/:id/images/:imageId`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "_id": "...",
    "name": "Product Name",
    "images": [...]
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/products/<PRODUCT_ID>/images/<IMAGE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Notes:**
- Automatically removes image from Cloudinary
- If deleted image was primary, first remaining image becomes primary
- Returns updated product with remaining images

---

### 3. Update Image Metadata
**PUT** `/api/products/:id/images/:imageId`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "alt": "Updated alt text",      // Optional
  "isPrimary": true                // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "data": {
    "_id": "...",
    "name": "Product Name",
    "images": [...]
  }
}
```

**cURL Example:**
```bash
# Update alt text
curl -X PUT http://localhost:5000/api/products/<PRODUCT_ID>/images/<IMAGE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"alt": "New alt text"}'

# Set as primary
curl -X PUT http://localhost:5000/api/products/<PRODUCT_ID>/images/<IMAGE_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"isPrimary": true}'
```

**Notes:**
- Setting `isPrimary: true` automatically sets all other images to `isPrimary: false`
- Both fields are optional - update only what you need

---

## 🔐 Security & Validation

### File Upload Validation
1. **File Type:** Only JPEG, JPG, PNG, and WebP allowed
2. **File Size:** Maximum 5MB per file
3. **File Count:** Maximum 10 files per upload
4. **Authentication:** Admin token required
5. **Product Existence:** Validates product exists before upload

### Error Handling
- Invalid file types rejected with clear error message
- File size exceeds limit returns 400 error
- Unauthorized access returns 401
- Product not found returns 404
- Image not found returns 404
- Cloudinary failures handled gracefully

---

## 🛠️ Configuration

### Environment Variables
Required in `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Settings
- **Folder:** `muted-age/products`
- **Max Dimensions:** 1000x1000 (maintains aspect ratio)
- **Quality:** Auto-optimized
- **Format:** Auto (serves WebP to supporting browsers)
- **Crop:** Limit (doesn't upscale images)

### Multer Settings
- **Storage:** Memory (no disk writes)
- **Max File Size:** 5MB
- **Allowed Types:** image/jpeg, image/jpg, image/png, image/webp

---

## 🧪 Testing

### Run Test Script
```bash
./test-chapter-2.4.sh
```

### Test Coverage
The script tests:
1. ✅ Upload single image
2. ✅ Upload without authentication (should fail)
3. ✅ Upload invalid file type (should fail)
4. ✅ Update image alt text
5. ✅ Set image as primary
6. ✅ Update non-existent image (should fail)
7. ✅ Upload multiple images
8. ✅ Delete image
9. ✅ Delete without authentication (should fail)
10. ✅ Verify product has images

### Manual Testing with Postman

#### Setup
1. Login as admin to get token
2. Get a product ID from GET `/api/products`

#### Test Upload
1. Create POST request to `/api/products/:id/images`
2. Add Authorization header with Bearer token
3. In Body, select "form-data"
4. Add key "images" (type: File)
5. Select image file(s)
6. Add key "markPrimary" with value "true"
7. Send request

#### Test Update
1. Create PUT request to `/api/products/:id/images/:imageId`
2. Add Authorization header
3. Set Body to raw JSON:
```json
{
  "alt": "Updated description",
  "isPrimary": true
}
```
4. Send request

#### Test Delete
1. Create DELETE request to `/api/products/:id/images/:imageId`
2. Add Authorization header
3. Send request

---

## 📊 Database Schema Updates

### Product Model Changes
Added `publicId` field to ProductImageSchema:

```javascript
const ProductImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {          // NEW FIELD
    type: String,
  },
  alt: {
    type: String,
    default: 'Product image',
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, { _id: true });
```

**Why publicId?**
- Required for Cloudinary image deletion
- Links database records to cloud storage
- Enables efficient cleanup operations

---

## 🎯 Best Practices

### Image Upload
1. **Always mark one image as primary** for product display
2. **Use descriptive alt text** for SEO and accessibility
3. **Upload images in order** of importance (first = primary by default)
4. **Optimize images before upload** (recommended 800x800 to 1200x1200)

### Image Management
1. **Delete unused images** to save Cloudinary storage
2. **Update alt text** for better SEO
3. **Set appropriate primary image** for product listing
4. **Test uploads** with various file types and sizes

### Performance
1. **Batch uploads** when adding multiple images
2. **Use WebP format** when possible (smaller file size)
3. **Let Cloudinary handle optimization** (auto quality)
4. **Monitor Cloudinary usage** to avoid quota limits

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to upload image to Cloudinary"
**Solution:**
- Check `.env` file has correct Cloudinary credentials
- Verify Cloudinary account is active
- Check internet connection

### Issue: "Invalid file type"
**Solution:**
- Only JPEG, PNG, and WebP are supported
- Check file extension and actual MIME type
- Convert images if necessary

### Issue: "File too large"
**Solution:**
- Maximum size is 5MB
- Compress images before upload
- Use image optimization tools

### Issue: "Product not found"
**Solution:**
- Verify product ID is correct
- Ensure product exists and is not deleted
- Check database connection

### Issue: "Unauthorized"
**Solution:**
- Ensure using admin account token
- Check token hasn't expired
- Verify Authorization header format: `Bearer <token>`

---

## 📈 Future Enhancements

### Planned Features
1. **Bulk Delete** - Delete multiple images at once
2. **Image Reordering** - Drag-and-drop image order
3. **Image Variants** - Generate thumbnails and different sizes
4. **Image Compression** - Pre-upload compression
5. **Image Cropping** - Client-side image editing
6. **Progress Tracking** - Upload progress indicator
7. **Lazy Loading** - Optimize frontend image loading
8. **CDN Integration** - Faster image delivery

### Optimization Ideas
1. Generate multiple image sizes (thumbnail, medium, large)
2. Implement image lazy loading on frontend
3. Add image caching strategies
4. Implement image watermarking for brand protection
5. Add batch operations for multiple products

---

## 📝 Code Examples

### Uploading Images (JavaScript/Fetch)
```javascript
const uploadImages = async (productId, files, token) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });
  
  formData.append('markPrimary', 'true');
  
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}/images`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );
  
  return await response.json();
};
```

### Setting Primary Image (JavaScript/Fetch)
```javascript
const setPrimaryImage = async (productId, imageId, token) => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}/images/${imageId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isPrimary: true })
    }
  );
  
  return await response.json();
};
```

### Deleting Image (JavaScript/Fetch)
```javascript
const deleteImage = async (productId, imageId, token) => {
  const response = await fetch(
    `http://localhost:5000/api/products/${productId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
};
```

---

## ✅ Completion Checklist

- [x] Multer configuration with validation
- [x] Cloudinary integration and utilities
- [x] Image upload endpoint (multiple files)
- [x] Image delete endpoint
- [x] Image update endpoint
- [x] Product model updated with publicId
- [x] Admin-only access control
- [x] Error handling and validation
- [x] Test script created
- [x] Documentation completed

---

## 🎉 Summary

Chapter 2.4 successfully implements a complete image management system with:
- **Secure uploads** with file validation
- **Cloud storage** via Cloudinary
- **CRUD operations** for product images
- **Admin protection** on all endpoints
- **Automatic optimization** for web delivery
- **Comprehensive testing** with automated script

All endpoints tested and working correctly! ✨

---

**Next Steps:** Frontend integration for image upload UI and gallery management.
