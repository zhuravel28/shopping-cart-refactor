const CartService = require('../../src/CartService');
const DiscountCalculator = require('../../src/DiscountCalculator');
const ShippingCalculator = require('../../src/ShippingCalculator');

describe('DiscountCalculator unit tests', () => {
  test('gold discount is 25 percent', () => {
    const calculator = new DiscountCalculator();

    expect(calculator.calculate(1000, { loyaltyLevel: 'gold' })).toBe(250);
  });

  test('silver discount is 15 percent', () => {
    const calculator = new DiscountCalculator();

    expect(calculator.calculate(1000, { loyaltyLevel: 'silver' })).toBe(150);
  });

  test('promo code discount is 10 percent', () => {
    const calculator = new DiscountCalculator();

    expect(calculator.calculate(1000, {}, 'SALE10')).toBe(100);
  });

  test('no discount returns zero', () => {
    const calculator = new DiscountCalculator();

    expect(calculator.calculate(1000, {}, 'NONE')).toBe(0);
  });
});

describe('ShippingCalculator unit tests', () => {
  test('free shipping in Ukraine for subtotal more than 1000', () => {
    const calculator = new ShippingCalculator();

    expect(calculator.calculate(1200, { country: 'UA' })).toBe(0);
  });

  test('paid shipping in Ukraine for subtotal 1000 or less', () => {
    const calculator = new ShippingCalculator();

    expect(calculator.calculate(1000, { country: 'UA' })).toBe(80);
  });

  test('international shipping costs 250', () => {
    const calculator = new ShippingCalculator();

    expect(calculator.calculate(500, { country: 'DE' })).toBe(250);
  });
});

describe('CartService unit tests', () => {
  test('successful checkout returns order', () => {
    const service = new CartService();

    const result = service.checkout(
      { items: [{ name: 'Phone', price: 1000, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(result.success).toBe(true);
    expect(result.order.total).toBe(1080);
  });

  test('invalid cart returns error', () => {
    const service = new CartService();

    const result = service.checkout(null, {}, { country: 'UA' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Cart is empty');
  });

  test('storage error is handled', () => {
    const brokenStorage = {};

    Object.defineProperty(brokenStorage, 'lastOrder', {
      set() {
        throw new Error('Storage is unavailable');
      }
    });

    const service = new CartService(brokenStorage);

    const result = service.checkout(
      { items: [{ name: 'Phone', price: 1000, quantity: 1 }] },
      {},
      { country: 'UA' }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('Storage error');
  });
});