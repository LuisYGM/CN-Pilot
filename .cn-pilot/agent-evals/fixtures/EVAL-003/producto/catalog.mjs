export function queryCatalog(items, { query = "", category = "all", page = 1, pageSize = 10 } = {}) {
  const filtered = items;
  const total = filtered.length;
  return { items: filtered.slice(0, pageSize), total, page, pages: Math.ceil(total / pageSize) };
}
