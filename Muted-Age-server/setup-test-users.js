const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create admin user
    let admin = await User.findOne({ email: 'admin@mutedage.com' });
    
    if (admin) {
      console.log('Admin user exists, updating...');
      admin.password = 'Admin123!';
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin user updated with password: Admin123!');
    } else {
      admin = new User({
        username: 'adminuser',
        email: 'admin@mutedage.com',
        password: 'Admin123!',
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Find or create test user
    let user = await User.findOne({ email: 'user@example.com' });
    
    if (user) {
      console.log('✅ Test user already exists');
    } else {
      user = new User({
        username: 'testuser',
        email: 'user@example.com',
        password: 'Password123!',
        role: 'user',
      });
      await user.save();
      console.log('✅ Test user created');
    }

    console.log('\n✅ Test users ready:');
    console.log('   User: user@example.com / Password123!');
    console.log('   Admin: admin@mutedage.com / Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

setupTestUsers();
