require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/config');

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@mutedage.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      await mongoose.connection.close();
      return;
    }

    // Reset password
    const newPassword = 'Admin@123456';
    admin.password = newPassword;
    await admin.save();

    console.log('\n✅ Password reset successfully!');
    console.log('\n📋 Updated Credentials:');
    console.log('Email: admin@mutedage.com');
    console.log('Password: Admin@123456');
    console.log('\n✨ You can now use these credentials to login!');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
