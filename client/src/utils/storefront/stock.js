export function availableStock(product) {
  if (!product) return 0;
  if (Array.isArray(product.sizes) && product.sizes.length) {
    return product.sizes.reduce(
      (sum, size) => sum + (Number(size.stock) || 0),
      0
    );
  }
  return Number(product.stock) || 0;
}

export function isOutOfStock(product) {
  return availableStock(product) <= 0;
}
