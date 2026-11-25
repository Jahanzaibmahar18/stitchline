import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { availableStock } from "../../utils/storefront/stock";

const CartContext = createContext(null);
const STORAGE_KEY = "stitchlane-cart";

export const BAG_SIZE_OPTIONS = [
  { name: "Small", price: 1100 },
  { name: "Medium", price: 1300 },
  { name: "Large", price: 1400 },
];

export const POUCH_DESIGN_OPTIONS = [
  { name: "Simple Roti Pouch", price: 800 },
  { name: "Roti Pouch with Lace Design", price: 1000 },
];

const BAG_SLUGS = new Set([
  "stripe-storage-tote",
  "teal-geometric-tote",
  "wildflower-linen-bin",
]);

const BAG_SIZE_NAMES = new Set(["Small", "Medium", "Large"]);

function isBagProduct(productOrItem) {
  if (!productOrItem) return false;
  if (productOrItem.requiresSize) return true;
  if (Array.isArray(productOrItem.sizes) && productOrItem.sizes.length > 0) {
    return true;
  }
  const id = productOrItem.id || productOrItem.slug || "";
  const name = productOrItem.name || "";
  if (BAG_SLUGS.has(id)) return true;
  return /tote|bin|storage/i.test(name) && !/pouch|roti/i.test(name);
}

function isPouchProduct(productOrItem) {
  if (!productOrItem || isBagProduct(productOrItem)) return false;
  if (productOrItem.requiresDesign) return true;
  const id = productOrItem.id || productOrItem.slug || "";
  const name = productOrItem.name || "";
  return /pouch|roti|warmer/i.test(name) || /roti|warmer|pouch/.test(id);
}

function priceForBagSize(sizeName) {
  return BAG_SIZE_OPTIONS.find((s) => s.name === sizeName)?.price;
}

function priceForPouchDesign(designName) {
  return POUCH_DESIGN_OPTIONS.find((d) => d.name === designName)?.price;
}

/** Upgrade legacy localStorage cart rows so variant UI always appears. */
export function normalizeCartItem(item) {
  if (!item) return item;
  const bag = isBagProduct(item);
  const pouch = isPouchProduct(item);

  if (bag) {
    const size = BAG_SIZE_NAMES.has(item.size) ? item.size : "";
    const price = size ? priceForBagSize(size) : Number(item.price) || 1100;
    return {
      ...item,
      requiresSize: true,
      requiresDesign: false,
      sizeOptions: BAG_SIZE_OPTIONS,
      size,
      price,
    };
  }

  if (pouch) {
    let design = "";
    if (POUCH_DESIGN_OPTIONS.some((d) => d.name === item.size)) {
      design = item.size;
    } else if (/lace/i.test(item.size || "") || /lace/i.test(item.name || "")) {
      design = "Roti Pouch with Lace Design";
    } else if (/simple/i.test(item.size || "")) {
      design = "Simple Roti Pouch";
    }

    const price = design
      ? priceForPouchDesign(design)
      : Number(item.price) || 800;

    return {
      ...item,
      requiresSize: false,
      requiresDesign: true,
      designOptions: POUCH_DESIGN_OPTIONS,
      size: design,
      price,
    };
  }

  return {
    ...item,
    requiresSize: false,
    requiresDesign: false,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
    } catch {
      return [];
    }
  });

  // Re-normalize once on mount in case logic changed after load
  useEffect(() => {
    setItems((prev) => prev.map(normalizeCartItem));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, options = {}) => {
    const {
      selectedImage,
      size = "",
      color = "",
      price,
    } = typeof options === "string"
      ? { selectedImage: options }
      : options || {};

    const stock = availableStock(product);
    if (stock <= 0) {
      return false;
    }

    const image = selectedImage || product.image;
    const bag = isBagProduct(product);
    const pouch = isPouchProduct(product);

    let resolvedSize = "";
    let unitPrice = Number(price != null ? price : product.price) || 0;
    let requiresSize = false;
    let requiresDesign = false;
    let sizeOptions = [];
    let designOptions = [];

    if (bag) {
      requiresSize = true;
      sizeOptions = BAG_SIZE_OPTIONS;
      resolvedSize = BAG_SIZE_NAMES.has(size) ? size : "";
      unitPrice = resolvedSize
        ? priceForBagSize(resolvedSize)
        : Number(product.sizes?.[0]?.price) || 1100;
    } else if (pouch) {
      requiresDesign = true;
      designOptions = POUCH_DESIGN_OPTIONS;
      if (POUCH_DESIGN_OPTIONS.some((d) => d.name === size)) {
        resolvedSize = size;
      } else if (
        /lace/i.test(product.size || "") ||
        /lace/i.test(product.name || "")
      ) {
        resolvedSize = "Roti Pouch with Lace Design";
      } else if (
        /simple/i.test(product.size || "") ||
        /simple/i.test(product.name || "")
      ) {
        resolvedSize = "Simple Roti Pouch";
      } else {
        resolvedSize = "";
      }
      unitPrice = resolvedSize
        ? priceForPouchDesign(resolvedSize)
        : Number(product.price) || 800;
    } else {
      resolvedSize = size || product.size || "";
    }

    const lineKey = bag
      ? `${product.id}::bag::${color || "default"}::${image}`
      : pouch
        ? `${product.id}::pouch::${color || "default"}::${image}`
        : `${product.id}::${resolvedSize || "default"}::${color || "default"}::${image}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.lineKey === lineKey);
      if (existing) {
        const nextQty = Math.min(stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.lineKey === lineKey ? { ...item, quantity: nextQty, stock } : item
        );
      }
      return [
        ...prev,
        normalizeCartItem({
          lineKey,
          id: product.id,
          name: product.name,
          price: unitPrice,
          image,
          size: resolvedSize,
          color,
          quantity: Math.min(stock, quantity),
          stock,
          requiresSize,
          requiresDesign,
          sizeOptions,
          designOptions,
        }),
      ];
    });
    return true;
  };

  const updateQuantity = (lineKey, quantity) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.lineKey !== lineKey && item.id !== lineKey) return item;
          const max =
            typeof item.stock === "number" && item.stock > 0
              ? item.stock
              : Infinity;
          return { ...item, quantity: Math.min(max, Math.max(1, quantity)) };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateSize = (lineKey, sizeName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.lineKey !== lineKey && item.id !== lineKey) return item;
        const normalized = normalizeCartItem(item);
        if (!normalized.requiresSize) return normalized;

        const nextPrice = priceForBagSize(sizeName) ?? normalized.price;
        return {
          ...normalized,
          size: sizeName,
          price: nextPrice,
          sizeOptions: BAG_SIZE_OPTIONS,
        };
      })
    );
  };

  const updateDesign = (lineKey, designName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.lineKey !== lineKey && item.id !== lineKey) return item;
        const normalized = normalizeCartItem(item);
        if (!normalized.requiresDesign) return normalized;

        const nextPrice = priceForPouchDesign(designName) ?? normalized.price;
        return {
          ...normalized,
          size: designName,
          price: nextPrice,
          designOptions: POUCH_DESIGN_OPTIONS,
        };
      })
    );
  };

  const removeFromCart = (lineKey) => {
    setItems((prev) =>
      prev.filter((item) => item.lineKey !== lineKey && item.id !== lineKey)
    );
  };

  const clearCart = () => setItems([]);

  const hasMissingVariants = useMemo(
    () =>
      items.some(
        (item) =>
          (item.requiresSize && !BAG_SIZE_NAMES.has(item.size)) ||
          (item.requiresDesign && !priceForPouchDesign(item.size))
      ),
    [items]
  );

  // Back-compat alias used by checkout
  const hasMissingBagSizes = hasMissingVariants;

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.requiresSize && !BAG_SIZE_NAMES.has(item.size)) return sum;
        if (item.requiresDesign && !priceForPouchDesign(item.size)) return sum;
        return sum + item.price * item.quantity;
      }, 0),
    [items]
  );

  const value = {
    items,
    count,
    subtotal,
    hasMissingBagSizes,
    hasMissingVariants,
    addToCart,
    updateQuantity,
    updateSize,
    updateDesign,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
