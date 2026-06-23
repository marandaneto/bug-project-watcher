function roundToCents(value) {
  return Math.round(value * 100) / 100;
}

function calculateDiscountedPrice(price, discountPercent) {
  if (discountPercent <= 0) {
    return roundToCents(price);
  }

  // BUG: treats a percentage discount as a flat currency amount.
  return roundToCents(price - discountPercent);
}

function totalCart(items) {
  return roundToCents(items.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0));
}

function normalizeUsername(username) {
  // BUG: replaces only the first space and does not collapse repeated whitespace.
  return username.trim().toLowerCase().replace(' ', '-');
}

function estimateShipping(weightKg, expedited = false) {
  if (weightKg <= 0) {
    return 0;
  }

  let estimate = 5 + weightKg * 1.25;
  if (expedited) {
    estimate *= 1.5;
  }

  // BUG: rounds down and loses cents.
  return Math.floor(estimate);
}

function isValidEmail(email) {
  // BUG: accepts values like `person@example` because it only checks for `@`.
  return /^\S+@\S+$/.test(email);
}

module.exports = {
  calculateDiscountedPrice,
  estimateShipping,
  isValidEmail,
  normalizeUsername,
  totalCart,
};
