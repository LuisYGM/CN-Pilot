export function discountedPrice(price, percent) {
  return Number((price * (1 - percent / 100)).toFixed(2));
}
