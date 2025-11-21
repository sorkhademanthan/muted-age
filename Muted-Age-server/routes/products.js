const express = require('express');
const Product = require('../models/Product'); // Assume a Product model is created

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product (protected route, add auth middleware)
router.post('/', async (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = new Product({ name, price, description });
  await newProduct.save();
  res.json(newProduct);
});

module.exports = router;
