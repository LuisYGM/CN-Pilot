import test from "node:test";
import assert from "node:assert/strict";
import { formatPrice } from "../producto/format-price.mjs";

test("formats the amount with exactly two decimals", () => {
  assert.equal(formatPrice(12), "12.00");
  assert.equal(formatPrice(12.5), "12.50");
});
