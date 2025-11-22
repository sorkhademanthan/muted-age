const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Product = require('../models/Product');

async function addIndexes() {
  try {
    console.log('\n📊 Adding/Updating Product Collection Indexes...\n');

    // Get existing indexes
    const existingIndexes = await Product.collection.getIndexes();
    console.log('📋 Existing indexes:', Object.keys(existingIndexes).join(', '));

    // Drop old text index if it exists (to recreate with tags)
    try {
      await Product.collection.dropIndex('name_text_description_text');
      console.log('🗑️  Dropped old text index');
    } catch (err) {
      // Index might not exist, that's ok
    }

    // Create compound indexes for common query patterns
    console.log('\n⏳ Creating new indexes...\n');

    // 1. Text search index on name, description, and tags
    await Product.collection.createIndex(
      { name: 'text', description: 'text', tags: 'text' },
      { 
        name: 'product_search_index',
        weights: { name: 10, tags: 5, description: 1 }
      }
    );
    console.log('✅ Created text search index (name, description, tags)');

    // 2. Category + Price index (for filtered queries)
    await Product.collection.createIndex(
      { category: 1, price: 1 },
      { name: 'category_price_index' }
    );
    console.log('✅ Created category + price compound index');

    // 3. Tags array index (for tag filtering)
    await Product.collection.createIndex(
      { tags: 1 },
      { name: 'tags_index' }
    );
    console.log('✅ Created tags array index');

    // 4. Rating + Review Count index (for sorting by rating)
    await Product.collection.createIndex(
      { averageRating: -1, reviewCount: -1 },
      { name: 'rating_reviews_index' }
    );
    console.log('✅ Created rating + review count index');

    // 5. Featured + CreatedAt index (for featured sorting)
    await Product.collection.createIndex(
      { isFeatured: -1, createdAt: -1 },
      { name: 'featured_date_index' }
    );
    console.log('✅ Created featured + date index');

    // 6. Active + TotalStock index (for in-stock filtering)
    await Product.collection.createIndex(
      { isActive: 1, totalStock: 1 },
      { name: 'active_stock_index' }
    );
    console.log('✅ Created active + stock index');

    // 7. Sold Count index (for popularity sorting)
    await Product.collection.createIndex(
      { soldCount: -1 },
      { name: 'sold_count_index' }
    );
    console.log('✅ Created sold count index');

    // 8. Variant size index (for size filtering)
    await Product.collection.createIndex(
      { 'variants.size': 1 },
      { name: 'variant_size_index' }
    );
    console.log('✅ Created variant size index');

    // 9. Brand index (for brand filtering/autocomplete)
    await Product.collection.createIndex(
      { brand: 1 },
      { name: 'brand_index' }
    );
    console.log('✅ Created brand index');

    // Get final list of indexes
    const finalIndexes = await Product.collection.getIndexes();
    
    console.log('\n📊 Final Index List:');
    console.log('─────────────────────────────────────────');
    Object.keys(finalIndexes).forEach(indexName => {
      console.log(`   ✓ ${indexName}`);
    });

    console.log('\n🎉 All indexes created successfully!');
    console.log('\n💡 These indexes will improve query performance for:');
    console.log('   • Text search (name, description, tags)');
    console.log('   • Category filtering');
    console.log('   • Price range filtering');
    console.log('   • Tag filtering');
    console.log('   • Rating sorting');
    console.log('   • Featured products');
    console.log('   • In-stock filtering');
    console.log('   • Popularity sorting');
    console.log('   • Size filtering');
    console.log('   • Brand filtering');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating indexes:', error.message);
    process.exit(1);
  }
}

addIndexes();
