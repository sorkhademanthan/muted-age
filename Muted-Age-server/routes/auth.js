const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assume a User model is created

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // Input validation (add more as needed)
  if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Login (similar structure)
router.post('/login', async (req, res) => {
  // Implement login logic with bcrypt and JWT
  res.json({ msg: 'Login endpoint' });
});

module.exports = router;
