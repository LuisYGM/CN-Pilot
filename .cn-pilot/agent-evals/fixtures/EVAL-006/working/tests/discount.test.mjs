import test from "node:test";
import assert from "node:assert/strict";
import { discountedPrice } from "../producto/discount.mjs";

test("applies percentage discounts and rounds to cents", () => {
  assert.equal(discountedPrice(100, 10), 90);
  assert.equal(discountedPrice(19.99, 0), 19.99);
  assert.equal(discountedPrice(19.99, 100), 0);
});
