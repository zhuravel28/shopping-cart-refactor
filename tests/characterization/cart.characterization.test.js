const CartService = require('../../original/CartService');

describe('CartService characterization tests', () => {
  test('empty cart returns error', () => {
    const service = new CartService();

    const result = service.checkout({ items: [] }, {}, { country: 'UA' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Cart is empty');
  });

  test('invalid item returns error', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: '', price: 100, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid item');
  });

  test('calculates subtotal correctly', () => {
    const service = new CartService();

    const result = service.checkout(
      {
        items: [
          { name: 'Phone', price: 500, quantity: 2 },
          { name: 'Case', price: 100, quantity: 1 }
        ]
      },
      {},
      { country: 'UA' }
    );

    expect(result.order.subtotal).toBe(1100);
  });

  test('gold user receives 25 percent discount', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'Laptop', price: 2000, quantity: 1 }] },
      { loyaltyLevel: 'gold' },
      { country: 'UA' }
    );

    expect(result.order.discount).toBe(500);
  });

  test('silver user receives 15 percent discount', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'Tablet', price: 1000, quantity: 1 }] },
      { loyaltyLevel: 'silver' },
      { country: 'UA' }
    );

    expect(result.order.discount).toBe(150);
  });

  test('promo code SALE10 gives 10 percent discount', () => {
    const service = new CartService();

    const result = service.checkout(
      {
        promoCode: 'SALE10',
        items: [{ name: 'Mouse', price: 500, quantity: 1 }]
      },
      {},
      { country: 'UA' }
    );

    expect(result.order.discount).toBe(50);
  });

  test('shipping in Ukraine is free if subtotal more than 1000', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'TV', price: 1200, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(result.order.shipping).toBe(0);
  });

  test('shipping in Ukraine costs 80 if subtotal is less than or equal 1000', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'Keyboard', price: 500, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(result.order.shipping).toBe(80);
  });

  test('international shipping costs 250', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'Book', price: 200, quantity: 1 }] },
      {},
      { country: 'PL' }
    );

    expect(result.order.shipping).toBe(250);
  });

  test('order is saved to storage', () => {
    const storage = {};
    const service = new CartService(storage);

    service.checkout(
      { items: [{ name: 'Phone', price: 1000, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(storage.lastOrder).toBeDefined();
  });
});