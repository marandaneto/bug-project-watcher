const assert = require('node:assert/strict');
const test = require('node:test');
const {
  calculateDiscountedPrice,
  estimateShipping,
  isValidEmail,
  normalizeUsername,
  totalCart,
} = require('../src/business');

test('discount calculation applies a percentage discount', () => {
  assert.equal(calculateDiscountedPrice(250, 10), 225);
});

test('discount calculation leaves the price unchanged for a zero discount', () => {
  assert.equal(calculateDiscountedPrice(19.99, 0), 19.99);
});

test('cart total includes item quantities', () => {
  const items = [
    { name: 'Sticker', price: 3, quantity: 4 },
    { name: 'Notebook', price: 2.5, quantity: 2 },
  ];

  assert.equal(totalCart(items), 17);
});

test('username normalization trims, lowercases, and collapses whitespace', () => {
  assert.equal(normalizeUsername('  Ada   Lovelace  '), 'ada-lovelace');
});

test('shipping estimate preserves cents', () => {
  assert.notEqual(estimateShipping(2.2), 7);
  assert.equal(estimateShipping(2.2), 7.75);
});

test('email validation rejects addresses without a domain suffix', () => {
  assert.equal(isValidEmail('person@example'), false);
});

test('email validation accepts a basic valid email address', () => {
  assert.equal(isValidEmail('person@example.com'), true);
});
