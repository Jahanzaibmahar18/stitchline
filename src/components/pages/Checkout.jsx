import { useEffect, useState } from "react";
import { Link, useRouter } from "../../utils/router";
import {
  DELIVERY_CHARGE,
  fetchDeliveryCharge,
  formatPrice,
} from "../../data/products";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/client";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { navigate } = useRouter();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState(DELIVERY_CHARGE);

  useEffect(() => {
    fetchDeliveryCharge().then(setShipping);
  }, []);

  const total = subtotal + (items.length ? shipping : 0);

  if (!items.length && !placed) {
    return (
      <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
        <h1 className="font-serif text-4xl">Nothing to checkout</h1>
        <Link
          href="/products"
          className="mt-8 inline-block border-b border-[#4A250F] pb-1 text-sm uppercase tracking-[1.5px]"
        >
          Browse products
        </Link>
      </main>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    const payload = {
      customer: {
        name: form.get("name"),
        phone: form.get("phone"),
      },
      shippingAddress: {
        city: form.get("city"),
        address: form.get("address"),
      },
      items: items.map((item) => ({
        slug: item.id,
        id: item.id,
        quantity: item.quantity,
        image: item.image?.startsWith("http")
          ? item.image.replace(/^https?:\/\/[^/]+/, "")
          : item.image,
      })),
    };

    try {
      const res = await api("/api/orders", { method: "POST", body: payload });
      setOrderNumber(res.data.orderNumber);
      clearCart();
      setPlaced(true);
    } catch (err) {
      setError(err.message || "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <main className="bg-[#FAF3E8] px-5 py-24 text-center text-[#4A250F]">
        <p className="text-[10px] uppercase tracking-[3px] text-[#A87943]">
          Order confirmed
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          Thank you for shopping with StitchLane
        </h1>
        {orderNumber ? (
          <p className="mt-3 text-sm font-medium text-[#A87943]">
            Order number: {orderNumber}
          </p>
        ) : null}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#80664E]">
          Your cash on delivery order has been placed. We will contact you soon
          to confirm delivery details.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943]"
        >
          Back to home
        </button>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF3E8] text-[#4A250F]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-10 sm:py-16">
        <h1 className="font-serif text-4xl sm:text-5xl">Checkout</h1>
        <p className="mt-3 text-sm text-[#80664E]">
          Pay with cash on delivery across Pakistan.
        </p>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="border border-[#E4D2BA] bg-[#FFF9F1] p-6 sm:p-8"
          >
            <h2 className="font-serif text-2xl">Delivery details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                  Full name
                </span>
                <input
                  required
                  name="name"
                  className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A87943]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                  Phone
                </span>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A87943]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                  City
                </span>
                <input
                  required
                  name="city"
                  className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A87943]"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[11px] uppercase tracking-[1.5px] text-[#98704C]">
                  Full address
                </span>
                <textarea
                  required
                  name="address"
                  rows={4}
                  className="w-full border border-[#D9BFA0] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A87943]"
                />
              </label>
            </div>

            <div className="mt-8 border border-[#D6B477]/40 bg-[#FAF3E8] p-4">
              <p className="text-sm font-medium">Payment method</p>
              <p className="mt-1 text-sm text-[#80664E]">
                Cash on Delivery — pay when your order arrives.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-[#4A250F] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FAF3E8] transition hover:bg-[#A87943] disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place COD order"}
            </button>
          </form>

          <aside className="h-fit border border-[#E4D2BA] bg-[#FFF9F1] p-6">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.lineKey || item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="h-16 w-16 object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[#80664E]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-[#E4D2BA] pt-4 text-sm">
              <div className="flex justify-between text-[#80664E]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#80664E]">
                <span>Delivery</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
