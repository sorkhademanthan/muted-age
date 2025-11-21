# Admin Product Management Using MongoDB for Muted Age Clothing Brand Website

## Introduction
This document outlines how admins can manage and add product details for the Muted Age e-commerce website using MongoDB. It covers the database schema, CRUD operations, and workflows for efficient product handling. Admins interact via a secure backend interface (e.g., admin dashboard) to perform these tasks, ensuring data integrity and real-time updates.

## MongoDB Product Schema Overview
Products are stored in a MongoDB collection called `products`. Each document represents a product with the following key fields (using Mongoose for schema definition):

- **_id**: Auto-generated ObjectId for unique identification.
- **name**: String (required) - Product name, e.g., "Classic T-Shirt".
- **description**: String - Detailed product description.
- **category**: String (required) - e.g., "Men's", "Women's", "Accessories".
- **price**: Number (required) - Price in USD, e.g., 29.99.
- **images**: Array of Strings - URLs or paths to product images.
- **variants**: Array of Objects - Sub-documents for sizes/colors, e.g., [{ size: "M", color: "Black", stock: 50 }].
- **stock**: Number - Total available units (calculated from variants if applicable).
- **tags**: Array of Strings - For search/filtering, e.g., ["new-arrival", "sale"].
- **createdAt/updatedAt**: Timestamps (auto-managed by Mongoose).
- **isActive**: Boolean - Flag to enable/disable product visibility.

Example Document:
```json
{
  "_id": "ObjectId('...')",
  "name": "Muted Age Hoodie",
  "description": "Comfortable cotton hoodie with minimalist design.",
  "category": "Men's",
  "price": 49.99,
  "images": ["image1.jpg", "image2.jpg"],
  "variants": [
    { "size": "S", "color": "Gray", "stock": 20 },
    { "size": "M", "color": "Gray", "stock": 15 }
  ],
  "stock": 35,
  "tags": ["hoodie", "winter"],
  "isActive": true,
  "createdAt": "2023-10-01T00:00:00Z",
  "updatedAt": "2023-10-01T00:00:00Z"
}
```

## Admin Workflows for Product Management
Admins access these features through a secure admin panel (e.g., via JWT-authenticated routes in Express.js). Operations are performed via API calls to MongoDB.

### 1. **Adding a New Product**
   - **Step 1**: Log in to the admin dashboard.
   - **Step 2**: Navigate to "Add Product" form.
   - **Step 3**: Fill in details: Name, description, category, price, upload images, define variants (sizes/colors/stock).
   - **Step 4**: Validate inputs (e.g., ensure price > 0, stock >= 0).
   - **Step 5**: Submit: API creates a new document in the `products` collection.
   - **Step 6**: Confirmation: Product appears in the inventory list; frontend updates automatically.

### 2. **Viewing and Searching Products**
   - **Step 1**: Access the "Product List" in the admin dashboard.
   - **Step 2**: View paginated list with filters (e.g., by category, stock level).
   - **Step 3**: Search by name or tags using MongoDB queries (e.g., `$text` index for full-text search).
   - **Step 4**: Click a product to view full details, including variants and stock.

### 3. **Updating Product Details**
   - **Step 1**: Select a product from the list.
   - **Step 2**: Edit fields: Change price, description, add/remove images, update variants/stock.
   - **Step 3**: For stock updates: Adjust variant stock; recalculate total stock.
   - **Step 4**: Save: API updates the document in MongoDB (using `$set` or `$push` operators).
   - **Step 5**: Audit: Log changes for tracking (e.g., via a separate `auditLogs` collection).

### 4. **Deleting or Archiving Products**
   - **Step 1**: Select a product.
   - **Step 2**: Choose "Archive" (set `isActive: false`) or "Delete" (remove document).
   - **Step 3**: Confirm: API performs the operation; archived products remain in DB but are hidden from frontend.
   - **Step 4**: Handle dependencies: Ensure no active orders reference the product before deletion.

### 5. **Bulk Operations**
   - **Step 1**: Select multiple products.
   - **Step 2**: Apply bulk updates (e.g., change category for all, adjust prices by percentage).
   - **Step 3**: Use MongoDB's `bulkWrite` for efficiency.
   - **Step 4**: Validate and execute: Update multiple documents in one operation.

## Integration with Backend and Frontend
- **Backend**: Express.js routes handle requests (e.g., `POST /api/products` for adding). Mongoose models enforce schema and validation.
- **Database**: MongoDB ensures flexible queries; indexes on `category`, `name`, and `tags` for fast searches.
- **Frontend**: Admin dashboard fetches data via APIs; real-time updates use WebSockets or polling.
- **Security**: All operations require admin JWT; rate limiting prevents abuse.
- **Error Handling**: Validate data on input; handle MongoDB errors (e.g., duplicate keys).

## Best Practices
- **Validation**: Use Mongoose validators to ensure data quality (e.g., required fields, positive numbers).
- **Indexing**: Add indexes on frequently queried fields for performance.
- **Backup**: Regularly backup MongoDB to prevent data loss.
- **Scalability**: For high traffic, use MongoDB Atlas or sharding.
- **Testing**: Unit tests for CRUD operations; integration tests for admin workflows.

This setup allows admins to efficiently manage products. For code examples or API specs, refer to the backend repository or contact the development team.
