import test from "node:test";
import assert from "node:assert/strict";
import { queryCatalog } from "./catalog.mjs";

const items = [
  { id: 1, name: "Notebook", category: "books" },
  { id: 2, name: "Desk Lamp", category: "tools" },
  { id: 3, name: "Sketchbook", category: "books" },
  { id: 4, name: "Pen", category: "tools" }
];

test("query and category compose, and pagination reports consistent totals", () => {
  const result = queryCatalog(items, { query: "BOOK", category: "books", page: 1, pageSize: 1 });
  assert.deepEqual(result.items.map(({ id }) => id), [1]);
  assert.equal(result.total, 2);
  assert.equal(result.page, 1);
  assert.equal(result.pages, 2);
});

test("empty results have zero pages and a safe page value", () => {
  assert.deepEqual(queryCatalog(items, { query: "missing", page: 8 }), { items: [], total: 0, page: 0, pages: 0 });
});
