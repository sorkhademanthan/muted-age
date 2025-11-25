/**
 * Order Number Generator Utility
 * Generates unique sequential order numbers in format: MA-YYYY-XXX
 * 
 * Format:
 * - MA: Muted Age prefix
 * - YYYY: Current year
 * - XXX: Sequential 3-digit number (001, 002, etc.)
 * 
 * Examples: MA-2024-001, MA-2024-002, MA-2025-001
 */

const mongoose = require('mongoose');

/**
 * Generate unique order number
 * @param {Model} OrderModel - Mongoose Order model
 * @returns {Promise<String>} - Generated order number
 */
async function generateOrderNumber(OrderModel) {
  const year = new Date().getFullYear();
  const prefix = `MA-${year}`;
  
  // Find the last order for current year
  const lastOrder = await OrderModel.findOne({
    orderNumber: new RegExp(`^${prefix}-`)
  })
    .sort({ orderNumber: -1 })
    .select('orderNumber')
    .lean();
  
  let sequence = 1;
  
  if (lastOrder && lastOrder.orderNumber) {
    // Extract sequence number from last order
    const parts = lastOrder.orderNumber.split('-');
    const lastSequence = parseInt(parts[2], 10);
    
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }
  
  // Format: MA-YYYY-XXX (e.g., MA-2024-001)
  const orderNumber = `${prefix}-${sequence.toString().padStart(3, '0')}`;
  
  return orderNumber;
}

/**
 * Validate order number format
 * @param {String} orderNumber - Order number to validate
 * @returns {Boolean} - True if valid
 */
function isValidOrderNumber(orderNumber) {
  // Format: MA-YYYY-XXX
  const regex = /^MA-\d{4}-\d{3}$/;
  return regex.test(orderNumber);
}

/**
 * Parse order number into components
 * @param {String} orderNumber - Order number
 * @returns {Object} - {prefix, year, sequence}
 */
function parseOrderNumber(orderNumber) {
  if (!isValidOrderNumber(orderNumber)) {
    throw new Error('Invalid order number format');
  }
  
  const [prefix, year, sequence] = orderNumber.split('-');
  
  return {
    prefix,
    year: parseInt(year, 10),
    sequence: parseInt(sequence, 10),
  };
}

/**
 * Get order number year
 * @param {String} orderNumber - Order number
 * @returns {Number} - Year
 */
function getOrderYear(orderNumber) {
  const parsed = parseOrderNumber(orderNumber);
  return parsed.year;
}

/**
 * Get order sequence number
 * @param {String} orderNumber - Order number
 * @returns {Number} - Sequence
 */
function getOrderSequence(orderNumber) {
  const parsed = parseOrderNumber(orderNumber);
  return parsed.sequence;
}

/**
 * Check if order number is from current year
 * @param {String} orderNumber - Order number
 * @returns {Boolean}
 */
function isCurrentYearOrder(orderNumber) {
  const currentYear = new Date().getFullYear();
  const orderYear = getOrderYear(orderNumber);
  return orderYear === currentYear;
}

module.exports = {
  generateOrderNumber,
  isValidOrderNumber,
  parseOrderNumber,
  getOrderYear,
  getOrderSequence,
  isCurrentYearOrder,
};
