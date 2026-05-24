class ShippingCalculator {
  static FREE_SHIPPING_LIMIT = 1000;
  static UKRAINE_SHIPPING = 80;
  static INTERNATIONAL_SHIPPING = 250;

  calculate(subtotal, address) {
    if (address && address.country === 'UA') {
      return subtotal > ShippingCalculator.FREE_SHIPPING_LIMIT
        ? 0
        : ShippingCalculator.UKRAINE_SHIPPING;
    }

    return ShippingCalculator.INTERNATIONAL_SHIPPING;
  }
}

module.exports = ShippingCalculator;