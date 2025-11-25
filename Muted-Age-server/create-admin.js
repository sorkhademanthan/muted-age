require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/config');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('\n📋 Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      
      // List all users
      const allUsers = await User.find({}).select('email username role');
      console.log('\n👥 All users in database:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} | ${user.username} | ${user.role}`);
      });
      
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@mutedage.com',
      password: 'Admin@123456',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    await adminUser.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: admin@mutedage.com');
    console.log('Password: Admin@123456');
    console.log('\n⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
