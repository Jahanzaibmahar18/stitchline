import { useState } from "react";
import { Link, useRouter } from "../../utils/router";
import { formatPrice, getProductById } from "../../data/products";
import { useCart } from "../../context/CartContext";

export default function ProductDetail({ id }) {
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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

  const gallery = product.gallery?.length ? product.gallery : [product.image];

  const handleAdd = () => {
    addToCart(product, quantity, gallery[activeImage]);
  };

  const handleBuy = () => {
    addToCart(product, quantity, gallery[activeImage]);
    navigate("/checkout");
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
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-medium text-[#A87943]">
              {formatPrice(product.price)}
            </span>
            {product.compareAt ? (
              <span className="text-[#9A7F65] line-through">
                {formatPrice(product.compareAt)}
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

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center border border-[#D9BFA0]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg"
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-3 text-lg"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943]"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={handleBuy}
              className="border border-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] transition hover:bg-[#4A250F] hover:text-[#FAF3E8]"
            >
              Buy now
            </button>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[1.5px] text-[#98704C]">
            Cash on delivery available nationwide
          </p>
        </div>
      </section>
    </main>
  );
}
