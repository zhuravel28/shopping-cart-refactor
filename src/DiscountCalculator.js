class DiscountCalculator {
  static GOLD_DISCOUNT = 0.25;
  static SILVER_DISCOUNT = 0.15;
  static PROMO_DISCOUNT = 0.1;
  static PROMO_CODE = 'SALE10';

  calculate(subtotal, user, promoCode) {
    if (user && user.loyaltyLevel === 'gold') {
      return subtotal * DiscountCalculator.GOLD_DISCOUNT;
    }

    if (user && user.loyaltyLevel === 'silver') {
      return subtotal * DiscountCalculator.SILVER_DISCOUNT;
    }

    if (promoCode === DiscountCalculator.PROMO_CODE) {
      return subtotal * DiscountCalculator.PROMO_DISCOUNT;
    }

    return 0;
  }
}

module.exports = DiscountCalculator;