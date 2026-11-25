import { Link } from "../../utils/storefront/router";
import { formatPrice } from "../../data/storefront/products";
import {
  BAG_SIZE_OPTIONS,
  POUCH_DESIGN_OPTIONS,
  useCart,
} from "../../context/storefront/CartContext";

export default function Cart() {
  const {
    items,
    subtotal,
    updateQuantity,
    updateSize,
    updateDesign,
    removeFromCart,
    hasMissingVariants,
  } = useCart();

  if (!items.length) {
    return (
      <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
        <h1 className="font-serif text-4xl sm:text-5xl">Your bag is empty</h1>
        <p className="mt-4 text-sm text-[#80664E]">
          Discover handcrafted pieces made for everyday elegance.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943]"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10 sm:py-16">
        <h1 className="font-serif text-4xl sm:text-5xl">Shopping bag</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5">
            {items.map((item) => {
              const sizeOptions = item.sizeOptions?.length
                ? item.sizeOptions
                : BAG_SIZE_OPTIONS;
              const designOptions = item.designOptions?.length
                ? item.designOptions
                : POUCH_DESIGN_OPTIONS;
              const needsSize = item.requiresSize;
              const needsDesign = item.requiresDesign;
              const variantReady = needsSize
                ? ["Small", "Medium", "Large"].includes(item.size)
                : needsDesign
                  ? Boolean(
                      designOptions.find((d) => d.name === item.size)
                    )
                  : true;

              return (
                <div
                  key={item.lineKey || item.id}
                  className="grid gap-4 border border-[#E4D2BA] bg-[#FFF9F1] p-4 sm:grid-cols-[120px_1fr] sm:gap-6"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-full object-cover sm:h-28"
                  />
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-serif text-2xl">{item.name}</h2>
                        {item.color ? (
                          <p className="mt-1 text-sm text-[#80664E]">
                            {item.color}
                          </p>
                        ) : null}
                        {variantReady ? (
                          <p className="mt-1 text-sm text-[#80664E]">
                            {item.size}
                          </p>
                        ) : null}
                        <p className="mt-1 text-sm text-[#A87943]">
                          {variantReady
                            ? formatPrice(item.price)
                            : needsSize
                              ? "Select a size"
                              : "Select a design"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineKey || item.id)}
                        className="text-xs uppercase tracking-[1.5px] text-[#98704C] transition hover:text-[#4A250F]"
                      >
                        Remove
                      </button>
                    </div>

                    {needsSize ? (
                      <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                          Select size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sizeOptions.map((size) => (
                            <button
                              key={size.name}
                              type="button"
                              onClick={() =>
                                updateSize(item.lineKey || item.id, size.name)
                              }
                              className={`min-w-[5.5rem] border px-3 py-2 text-sm transition ${
                                item.size === size.name
                                  ? "border-[#4A250F] bg-[#4A250F] text-[#FAF3E8]"
                                  : "border-[#D9BFA0] bg-transparent hover:border-[#A87943]"
                              }`}
                            >
                              <span className="block font-medium">
                                {size.name}
                              </span>
                              <span className="block text-[11px] opacity-80">
                                {formatPrice(size.price)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {needsDesign ? (
                      <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                          Select design
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {designOptions.map((design) => (
                            <button
                              key={design.name}
                              type="button"
                              onClick={() =>
                                updateDesign(
                                  item.lineKey || item.id,
                                  design.name
                                )
                              }
                              className={`min-w-[8rem] border px-3 py-2 text-sm transition ${
                                item.size === design.name
                                  ? "border-[#4A250F] bg-[#4A250F] text-[#FAF3E8]"
                                  : "border-[#D9BFA0] bg-transparent hover:border-[#A87943]"
                              }`}
                            >
                              <span className="block font-medium">
                                {design.name === "Simple Roti Pouch"
                                  ? "Simple"
                                  : "Lace Design"}
                              </span>
                              <span className="block text-[11px] opacity-80">
                                {formatPrice(design.price)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D9BFA0]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.lineKey || item.id,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.lineKey || item.id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {variantReady
                          ? formatPrice(item.price * item.quantity)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit border border-[#E4D2BA] bg-[#FFF9F1] p-6">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-[#80664E]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#80664E]">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-[#E4D2BA] pt-4 text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            {hasMissingVariants ? (
              <p className="mt-4 text-xs text-red-700">
                Select size/design for every item before checkout.
              </p>
            ) : (
              <p className="mt-4 text-xs uppercase tracking-[1.5px] text-[#98704C]">
                Cash on delivery available
              </p>
            )}
            {hasMissingVariants ? (
              <button
                type="button"
                disabled
                className="mt-6 block w-full cursor-not-allowed bg-[#4A250F]/50 px-7 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8]"
              >
                Complete selections to continue
              </button>
            ) : (
              <Link
                href="/checkout"
                className="mt-6 block bg-[#4A250F] px-7 py-3.5 text-center text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943]"
              >
                Proceed to checkout
              </Link>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
