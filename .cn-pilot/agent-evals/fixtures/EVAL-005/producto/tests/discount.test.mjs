import test from "node:test";
import assert from "node:assert/strict";
import { discountedPrice } from "../src/discount.mjs";

test("applies a percentage discount to a price", () => {
  assert.equal(discountedPrice(100, 10), 90);
  assert.equal(discountedPrice(20, 25), 15);
});
