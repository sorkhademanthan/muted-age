const { AppError } = require('../middleware/errorHandler');

class CartValidationUtils {
  // Maximum quantity per cart item
  static MAX_QUANTITY_PER_ITEM = 99;
  
  // Maximum total items in cart
  static MAX_CART_ITEMS = 50;
  
  // Minimum order amount
  static MIN_ORDER_AMOUNT = 1;
  
  // Maximum order amount
  static MAX_ORDER_AMOUNT = 99999.99;
  
  // Low stock threshold for warnings
  static LOW_STOCK_THRESHOLD = 5;

  /**
   * Validate if quantity is within acceptable range
   */
  static validateQuantity(quantity, available = null) {
    if (quantity < 0) {
      throw new AppError('Quantity cannot be negative', 400);
    }

    if (quantity > this.MAX_QUANTITY_PER_ITEM) {
      throw new AppError(
        `Quantity cannot exceed ${this.MAX_QUANTITY_PER_ITEM} per item`, 
        400
      );
    }

    if (available !== null && quantity > available) {
      throw new AppError(
        `Insufficient stock. Only ${available} available`, 
        400
      );
    }

    return true;
  }

  /**
   * Check if adding items would exceed cart limit
   */
  static validateCartSize(currentItemCount, additionalItems = 1) {
    const newTotal = currentItemCount + additionalItems;
    
    if (newTotal > this.MAX_CART_ITEMS) {
      throw new AppError(
        `Cart cannot contain more than ${this.MAX_CART_ITEMS} unique items`, 
        400
      );
    }

    return true;
  }

  /**
   * Validate cart total amount
   */
  static validateCartTotal(total) {
    if (total < this.MIN_ORDER_AMOUNT) {
      throw new AppError(
        `Order total must be at least $${this.MIN_ORDER_AMOUNT}`, 
        400
      );
    }

    if (total > this.MAX_ORDER_AMOUNT) {
      throw new AppError(
        `Order total cannot exceed $${this.MAX_ORDER_AMOUNT}`, 
        400
      );
    }

    return true;
  }

  /**
   * Check if stock is low and return warning
   */
  static checkLowStock(availableStock) {
    if (availableStock <= this.LOW_STOCK_THRESHOLD && availableStock > 0) {
      return {
        warning: true,
        message: `Only ${availableStock} left in stock`,
        available: availableStock
      };
    }
    return null;
  }

  /**
   * Comprehensive stock validation for cart item
   */
  static async validateStock(product, variant, requestedQuantity) {
    const issues = [];

    // Check product exists and is active
    if (!product) {
      issues.push({
        field: 'product',
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
      return { valid: false, issues };
    }

    if (!product.isActive) {
      issues.push({
        field: 'product',
        message: 'Product is no longer available',
        code: 'PRODUCT_INACTIVE'
      });
      return { valid: false, issues };
    }

    // Check variant exists
    if (!variant) {
      issues.push({
        field: 'variant',
        message: 'Selected variant not found',
        code: 'VARIANT_NOT_FOUND'
      });
      return { valid: false, issues };
    }

    // Check stock availability
    if (variant.stock < requestedQuantity) {
      issues.push({
        field: 'quantity',
        message: `Insufficient stock. Only ${variant.stock} available`,
        code: 'INSUFFICIENT_STOCK',
        available: variant.stock,
        requested: requestedQuantity
      });
      return { valid: false, issues };
    }

    // Check for low stock warning
    const lowStockWarning = this.checkLowStock(variant.stock);

    return {
      valid: true,
      issues: [],
      warning: lowStockWarning
    };
  }

  /**
   * Validate entire cart for checkout
   */
  static async validateCartForCheckout(cart) {
    const issues = [];
    const warnings = [];

    // Check cart has items
    if (!cart.items || cart.items.length === 0) {
      issues.push({
        field: 'cart',
        message: 'Cart is empty',
        code: 'EMPTY_CART'
      });
      return { valid: false, issues, warnings };
    }

    // Validate cart total
    try {
      this.validateCartTotal(cart.total);
    } catch (error) {
      issues.push({
        field: 'total',
        message: error.message,
        code: 'INVALID_TOTAL'
      });
    }

    // Validate each item stock
    const stockIssues = await cart.checkStock();
    if (stockIssues.length > 0) {
      issues.push(...stockIssues.map(issue => ({
        field: 'stock',
        message: issue.issue,
        code: 'STOCK_ISSUE',
        details: issue
      })));
    }

    // Check for low stock warnings on items
    for (const item of cart.items) {
      if (item.product && item.product.variants) {
        const variant = item.product.variants.id(item.variant.variantId);
        if (variant) {
          const lowStockWarning = this.checkLowStock(variant.stock);
          if (lowStockWarning) {
            warnings.push({
              itemId: item._id,
              productName: item.product.name,
              size: item.variant.size,
              ...lowStockWarning
            });
          }
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings
    };
  }

  /**
   * Validate coupon code format
   */
  static validateCouponFormat(couponCode) {
    if (!couponCode || typeof couponCode !== 'string') {
      throw new AppError('Invalid coupon code', 400);
    }

    const trimmedCode = couponCode.trim().toUpperCase();

    if (trimmedCode.length < 3 || trimmedCode.length > 20) {
      throw new AppError('Coupon code must be between 3 and 20 characters', 400);
    }

    if (!/^[A-Z0-9]+$/.test(trimmedCode)) {
      throw new AppError(
        'Coupon code must contain only uppercase letters and numbers', 
        400
      );
    }

    return trimmedCode;
  }

  /**
   * Validate shipping cost
   */
  static validateShippingCost(shippingCost) {
    if (typeof shippingCost !== 'number') {
      throw new AppError('Shipping cost must be a number', 400);
    }

    if (shippingCost < 0) {
      throw new AppError('Shipping cost cannot be negative', 400);
    }

    if (shippingCost > 999.99) {
      throw new AppError('Shipping cost cannot exceed $999.99', 400);
    }

    return true;
  }

  /**
   * Check if product has sufficient total stock across all variants
   */
  static checkTotalProductStock(product, requiredQuantity) {
    if (!product.variants || product.variants.length === 0) {
      return { available: false, totalStock: 0 };
    }

    const totalStock = product.variants.reduce(
      (sum, variant) => sum + (variant.stock || 0), 
      0
    );

    return {
      available: totalStock >= requiredQuantity,
      totalStock
    };
  }

  /**
   * Get available alternatives when requested variant is out of stock
   */
  static getAvailableAlternatives(product, excludeVariantId) {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    return product.variants
      .filter(v => 
        v._id.toString() !== excludeVariantId.toString() && 
        v.stock > 0
      )
      .map(v => ({
        variantId: v._id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        lowStock: v.stock <= this.LOW_STOCK_THRESHOLD
      }));
  }
}

module.exports = CartValidationUtils;
