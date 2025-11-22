const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const User = require('./models/User');

async function makeAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node make-admin.js <email>');
      console.log('Example: node make-admin.js admin@mutedage.com');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      console.log('\n📝 Available users:');
      const allUsers = await User.find().select('email username role');
      allUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.username}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    console.log(`\n📋 Current User Info:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Current Role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('\n✅ User is already an admin!');
    } else {
      // Update role to admin
      user.role = 'admin';
      await user.save();
      console.log('\n✅ User role updated to ADMIN successfully!');
    }

    console.log(`\n🔑 Next Steps:`);
    console.log(`   1. Login to get a new token with admin role`);
    console.log(`   2. Use this command:`);
    console.log(`\n   curl -X POST http://localhost:5000/api/auth/login \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"email": "${email}", "password": "YOUR_PASSWORD"}'`);
    console.log(`\n   3. Copy the token from the response`);
    console.log(`   4. Use it in your requests: Authorization: Bearer YOUR_TOKEN`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
