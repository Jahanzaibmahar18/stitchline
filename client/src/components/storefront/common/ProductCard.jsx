import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "../../../utils/storefront/router";
import { formatPrice } from "../../../data/storefront/products";
import { useCart } from "../../../context/storefront/CartContext";
import { isOutOfStock } from "../../../utils/storefront/stock";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = isOutOfStock(product);
  const gallery = useMemo(
    () =>
      product.gallery?.length
        ? product.gallery
        : [product.image].filter(Boolean),
    [product.gallery, product.image]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const intervalRef = useRef(null);

  const showSwatches = gallery.length >= 2;
  const canCycle = gallery.length > 1;

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setIsTouch(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (!hovered || !canCycle || isTouch) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % gallery.length);
    }, 1400);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hovered, canCycle, gallery.length, isTouch]);

  const handleMouseEnter = () => {
    if (isTouch) return;
    setHovered(true);
    if (gallery.length > 1) setActiveIndex(1 % gallery.length);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setActiveIndex(0);
  };

  const handleImageTap = (event) => {
    if (!isTouch || gallery.length < 2) return;
    event.preventDefault();
    setActiveIndex((current) => (current + 1) % gallery.length);
    setHovered(true);
  };

  const handleSwatchSelect = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(index);
    setHovered(true);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1, gallery[activeIndex] || product.image);
  };

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden bg-[#EFE3D2]">
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-[4/5] overflow-hidden"
          onClick={isTouch && canCycle ? handleImageTap : undefined}
          aria-label={product.name}
        >
          {gallery.map((src, index) => (
            <img
              key={`${product.id}-${index}`}
              src={src}
              alt={index === 0 ? product.name : ""}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              } ${hovered && !isTouch ? "scale-[1.03]" : "scale-100"}`}
              draggable={false}
            />
          ))}
        </Link>

        {outOfStock ? (
          <span className="pointer-events-none absolute left-3 top-3 z-10 bg-[#4A250F] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-[#FAF3E8]">
            Out of Stock
          </span>
        ) : product.discount ? (
          <span className="pointer-events-none absolute left-3 top-3 z-10 bg-[#4A250F] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-[#FAF3E8]">
            {product.discount}% off
          </span>
        ) : null}

        <div
          className={`absolute inset-x-0 bottom-0 z-20 px-3 pb-3 transition-all duration-300 ease-out ${
            hovered || isTouch
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-5 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex w-full items-center justify-center gap-2 bg-[#FAF3E8]/95 px-4 py-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#4A250F] shadow-sm backdrop-blur-sm transition hover:bg-[#4A250F] hover:text-[#FAF3E8] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#FAF3E8]/95 disabled:hover:text-[#4A250F]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M6 7h12l1 14H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {outOfStock ? "Out of Stock" : "Add to cart"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col text-center">
        <p className="text-[10px] uppercase tracking-[2px] text-[#A87943]">
          {product.category}
          {product.sizes?.length
            ? " · S / M / L"
            : product.size
              ? ` · ${product.size}`
              : ""}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-1 font-serif text-xl text-[#4A250F] transition group-hover:text-[#A87943] sm:text-2xl">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <span className="font-medium text-[#A87943]">
            {product.sizes?.length > 1
              ? `From ${formatPrice(product.sizes[0].price)}`
              : formatPrice(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-[#9A7F65] line-through">
              {formatPrice(product.compareAt)}
            </span>
          ) : null}
        </div>

        {showSwatches ? (
          <div className="mt-3 flex items-center justify-center gap-2">
            {gallery.slice(0, 3).map((src, index) => (
              <button
                key={`${product.id}-swatch-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={(event) => handleSwatchSelect(event, index)}
                className={`h-5 w-5 overflow-hidden rounded-full border transition ${
                  activeIndex === index
                    ? "border-[#4A250F] ring-1 ring-[#A87943]/50 scale-110"
                    : "border-[#D9BFA0] hover:border-[#A87943]"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
