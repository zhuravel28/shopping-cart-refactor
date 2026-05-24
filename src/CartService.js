const DiscountCalculator = require('./DiscountCalculator');
const ShippingCalculator = require('./ShippingCalculator');

class CartService {
  constructor(storage) {
    this.storage = storage || {};
    this.discountCalculator = new DiscountCalculator();
    this.shippingCalculator = new ShippingCalculator();
  }

  checkout(cart, user, address) {
    if (!this.isValidCart(cart)) {
      return { success: false, message: 'Cart is empty' };
    }

    const invalidItem = cart.items.find((item) => !this.isValidItem(item));

    if (invalidItem) {
      return { success: false, message: 'Invalid item' };
    }

    const subtotal = this.calculateSubtotal(cart.items);
    const discount = this.discountCalculator.calculate(
      subtotal,
      user,
      cart.promoCode
    );
    const shipping = this.shippingCalculator.calculate(subtotal, address);
    const total = subtotal - discount + shipping;

    const order = this.createOrder(
      cart.items,
      subtotal,
      discount,
      shipping,
      total,
      address
    );

    const saved = this.saveOrder(order);

    if (!saved) {
      return { success: false, message: 'Storage error' };
    }

    return { success: true, order };
  }

  isValidCart(cart) {
    return cart && Array.isArray(cart.items) && cart.items.length > 0;
  }

  isValidItem(item) {
    return item && item.name && item.price > 0 && item.quantity > 0;
  }

  calculateSubtotal(items) {
    return items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  createOrder(items, subtotal, discount, shipping, total, address) {
    return {
      items,
      subtotal,
      discount,
      shipping,
      total,
      address,
      createdAt: new Date().toISOString()
    };
  }

  saveOrder(order) {
    try {
      this.storage.lastOrder = JSON.stringify(order);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = CartService;