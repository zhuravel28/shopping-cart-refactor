class CartService {
  constructor(storage) {
    this.storage = storage || {};
  }

  checkout(cart, user, address) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    let subtotal = 0;

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];

      if (!item.name || item.price <= 0 || item.quantity <= 0) {
        return { success: false, message: 'Invalid item' };
      }

      subtotal += item.price * item.quantity;
    }

    let discount = 0;

    if (user && user.loyaltyLevel === 'gold') {
      discount = subtotal * 0.25;
    } else if (user && user.loyaltyLevel === 'silver') {
      discount = subtotal * 0.15;
    } else if (cart.promoCode === 'SALE10') {
      discount = subtotal * 0.1;
    }

    let shipping = 0;

    if (address && address.country === 'UA') {
      shipping = subtotal > 1000 ? 0 : 80;
    } else {
      shipping = 250;
    }

    const total = subtotal - discount + shipping;

    const order = {
      items: cart.items,
      subtotal,
      discount,
      shipping,
      total,
      address,
      createdAt: new Date().toISOString()
    };

    try {
      this.storage.lastOrder = JSON.stringify(order);
    } catch (error) {
      return { success: false, message: 'Storage error' };
    }

    return { success: true, order };
  }
}

module.exports = CartService;