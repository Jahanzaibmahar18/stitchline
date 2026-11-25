import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { formatPKR } from "../../data/admin/catalog";
import {
  ORDER_STATUSES,
  formatOrderStatus,
} from "../../utils/admin/orderStatus";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    api(`/api/admin/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        const s = res.data.status;
        setStatus(
          s === "pending" || s === "confirmed" ? "order_placed" : s
        );
        setPaymentStatus(res.data.paymentStatus);
      })
      .catch(() => setOrder(null));
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    try {
      await api(`/api/admin/orders/${id}`, {
        method: "PUT",
        body: { status, paymentStatus },
      });
      setMessage("Order updated.");
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const removeOrder = async () => {
    if (
      !confirm(
        `Delete order ${order.orderNumber}? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await api(`/api/admin/orders/${id}`, { method: "DELETE" });
      navigate("/orders");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!order) {
    return <p className="text-sm text-[#765236]">Loading order…</p>;
  }

  return (
    <div>
      <PageHeader title={order.orderNumber} subtitle="Order details & COD status" />
      {message ? (
        <p className="mb-4 rounded-md bg-[#FAF3E8] px-3 py-2 text-sm">{message}</p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5 text-sm">
          <h2 className="mb-3 font-semibold text-[#4A250F]">Customer</h2>
          <p>{order.customer?.name}</p>
          <p>{order.customer?.phone}</p>
          <p className="text-[#765236]">{order.customer?.email || "—"}</p>
          <p className="mt-3 text-[#765236]">
            {order.shippingAddress?.address}, {order.shippingAddress?.city}
            {order.shippingAddress?.postalCode
              ? ` · ${order.shippingAddress.postalCode}`
              : ""}
          </p>
          {order.customerRef?._id || order.customerRef ? (
            <Link
              to={`/customers/${order.customerRef._id || order.customerRef}`}
              className="mt-3 inline-block text-[#A87943]"
            >
              View customer profile
            </Link>
          ) : null}
        </section>
        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5 text-sm">
          <h2 className="mb-3 font-semibold text-[#4A250F]">Update status</h2>
          <label className="mb-3 block">
            Order status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#D9BFA0] px-3 py-2"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatOrderStatus(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="mb-3 block">
            Payment status (COD)
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#D9BFA0] px-3 py-2"
            >
              <option value="unpaid">unpaid</option>
              <option value="paid">paid</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-[#4A250F] px-4 py-2 text-[#FAF3E8]"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={removeOrder}
              className="rounded-md border border-red-300 px-4 py-2 text-red-700"
            >
              Delete order
            </button>
          </div>
          <p className="mt-3 text-xs text-[#765236]">
            Placed:{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "—"}
          </p>
        </section>
      </div>
      <section className="mt-6 rounded-xl border border-[#E4D2BA] bg-white p-5">
        <h2 className="mb-4 font-semibold text-[#4A250F]">Items</h2>
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <img src={item.image} alt="" className="h-12 w-12 object-cover" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-[#765236]">
                    {[item.size, item.color].filter(Boolean).join(" · ") ||
                      "—"}{" "}
                    · Qty {item.quantity} · {formatPKR(item.price)} each
                  </p>
                </div>
              </div>
              <p>{formatPKR(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-[#E4D2BA] pt-4 text-sm">
          <p>Subtotal: {formatPKR(order.subtotal)}</p>
          <p>Delivery: {formatPKR(order.shippingFee)}</p>
          <p className="font-semibold">Total: {formatPKR(order.total)}</p>
          <p className="mt-2 text-[#765236]">
            Status: {formatOrderStatus(order.status)} · Payment:{" "}
            {order.paymentMethod} / {order.paymentStatus}
          </p>
        </div>
      </section>
    </div>
  );
}
