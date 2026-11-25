import { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "../../utils/storefront/router";
import {
  fetchProductBySlug,
  formatPrice,
} from "../../data/storefront/products";
import { useCart } from "../../context/storefront/CartContext";
import { availableStock, isOutOfStock } from "../../utils/storefront/stock";

export default function ProductDetail({ id }) {
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProductBySlug(id)
      .then((item) => {
        if (!alive) return;
        setProduct(item);
        setActiveImage(0);
        const firstColor = item?.colors?.[0]?.name || "";
        setSelectedColor(firstColor);
        if (item?.colors?.[0]?.image) {
          const idx = (item.gallery || []).indexOf(item.colors[0].image);
          if (idx >= 0) setActiveImage(idx);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const gallery = useMemo(
    () => (product?.gallery?.length ? product.gallery : product ? [product.image] : []),
    [product]
  );

  const isBag = Boolean(product?.sizes?.length);
  const displayPrice = isBag
    ? product.sizes[0]?.price ?? product.price
    : product?.price ?? 0;
  const displayCompare = product?.compareAt;
  const outOfStock = isOutOfStock(product);
  const stockLeft = availableStock(product);

  if (loading) {
    return (
      <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
        <p className="text-sm text-[#80664E]">Loading product…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
        <h1 className="font-serif text-4xl">Product not found</h1>
        <Link
          href="/products"
          className="mt-6 inline-block border-b border-[#4A250F] pb-1 text-sm uppercase tracking-[1.5px]"
        >
          Back to products
        </Link>
      </main>
    );
  }

  const cartOptions = () => ({
    selectedImage: gallery[activeImage],
    // Bags/pouches: variant is confirmed in the cart (size or design).
    size: "",
    color: selectedColor,
    price: undefined,
  });

  const handleAdd = () => {
    if (outOfStock) {
      setStockError("This product is out of stock.");
      return;
    }
    if (quantity > stockLeft) {
      setStockError(`Only ${stockLeft} left in stock.`);
      return;
    }
    setStockError("");
    addToCart(product, quantity, cartOptions());
  };

  const handleBuy = () => {
    if (outOfStock) {
      setStockError("This product is out of stock.");
      return;
    }
    if (quantity > stockLeft) {
      setStockError(`Only ${stockLeft} left in stock.`);
      return;
    }
    setStockError("");
    addToCart(product, quantity, cartOptions());
    navigate("/cart");
  };

  const onColorSelect = (color) => {
    setSelectedColor(color.name);
    if (color.image) {
      const idx = gallery.indexOf(color.image);
      if (idx >= 0) setActiveImage(idx);
    }
  };

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <div className="overflow-hidden bg-[#EFE3D2]">
            <img
              src={gallery[activeImage]}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden border ${
                    activeImage === index
                      ? "border-[#A87943]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[3px] text-[#A87943]">
            {product.category}
            {!product.sizes?.length && product.size ? ` · ${product.size}` : ""}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-medium text-[#A87943]">
              {isBag
                ? `From ${formatPrice(displayPrice)}`
                : formatPrice(displayPrice)}
            </span>
            {displayCompare ? (
              <span className="text-[#9A7F65] line-through">
                {formatPrice(displayCompare)}
              </span>
            ) : null}
            {product.discount ? (
              <span className="bg-[#4A250F] px-2.5 py-1 text-[10px] uppercase tracking-[1.5px] text-[#FAF3E8]">
                {product.discount}% off
              </span>
            ) : null}
          </div>

          <p className="mt-6 max-w-lg text-sm leading-8 text-[#80664E]">
            {product.description}
          </p>

          {isBag ? (
            <p className="mt-6 text-sm text-[#80664E]">
              Available in Small (Rs. 1,100), Medium (Rs. 1,300), and Large
              (Rs. 1,400). Choose your size in the shopping bag.
            </p>
          ) : null}

          {product.colors?.length ? (
            <div className="mt-6">
              <p className="mb-3 text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                Color{selectedColor ? `: ${selectedColor}` : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={() => onColorSelect(color)}
                    className={`flex items-center gap-2 border px-3 py-2 text-sm transition ${
                      selectedColor === color.name
                        ? "border-[#4A250F] bg-[#FFF9F1]"
                        : "border-[#D9BFA0] hover:border-[#A87943]"
                    }`}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-[#D9BFA0]"
                      style={{
                        backgroundColor: color.hex || "#D9BFA0",
                      }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.details.map((detail) => (
              <li
                key={detail}
                className="border-l border-[#D6B477] pl-3 text-sm text-[#765236]"
              >
                {detail}
              </li>
            ))}
          </ul>

          {outOfStock ? (
            <p className="mt-8 text-sm font-medium uppercase tracking-[1.5px] text-red-700">
              Out of Stock
            </p>
          ) : (
            <p className="mt-6 text-xs uppercase tracking-[1.5px] text-[#98704C]">
              {stockLeft} in stock · Cash on delivery available nationwide
            </p>
          )}

          {stockError ? (
            <p className="mt-3 text-sm text-red-700">{stockError}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center border border-[#D9BFA0]">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={outOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={outOfStock}
                onClick={() =>
                  setQuantity((q) => Math.min(stockLeft || 1, q + 1))
                }
                className="px-4 py-3 text-lg disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className="bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? "Out of Stock" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={handleBuy}
              disabled={outOfStock}
              className="border border-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:bg-[#4A250F] hover:text-[#FAF3E8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
