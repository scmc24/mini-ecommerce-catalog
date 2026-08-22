const test = require('node:test');
const assert = require('node:assert');
const { findProduct } = require('./index');

test('findProduct returns the matching product', () => {
  const product = findProduct('2');
  assert.strictEqual(product.name, 'Souris sans fil');
});

test('findProduct returns null for an unknown id', () => {
  assert.strictEqual(findProduct('does-not-exist'), null);
});
