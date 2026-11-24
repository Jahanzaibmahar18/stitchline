import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";
import { formatPKR } from "../data/catalog";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");

  const load = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("search", q);
    api(`/api/admin/orders?${params}`)
      .then((res) => setOrders(res.data.items || res.data || []))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Cash on Delivery orders and fulfillment status."
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order # or customer"
          className="rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <button
          type="button"
          onClick={load}
          className="rounded-md bg-[#4A250F] px-4 py-2 text-sm text-[#FAF3E8]"
        >
          Filter
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[#765236]">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b border-[#F0E4D4]">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p>{o.customer?.name}</p>
                    <p className="text-xs text-[#765236]">{o.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3 capitalize">
                    {o.paymentMethod} · {o.paymentStatus}
                  </td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                  <td className="px-4 py-3">
                    <Link to={`/orders/${o._id}`} className="text-[#A87943]">
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
