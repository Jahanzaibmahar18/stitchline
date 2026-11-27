import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { formatPKR } from "../../data/admin/catalog";
import {
  ORDER_STATUSES,
  formatOrderStatus,
} from "../../utils/admin/orderStatus";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("search", q);
    api(`/api/admin/orders?${params}`)
      .then((res) => setOrders(res.data.items || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    try {
      await api(`/api/admin/orders/${id}`, {
        method: "PUT",
        body: { status: nextStatus },
      });
      setMessage("Order status updated.");
      load();
    } catch (err) {
      setMessage(err.message || "Update failed");
    }
  };

  const removeOrder = async (id, orderNumber) => {
    if (
      !confirm(
        `Delete order ${orderNumber}? This permanently removes it from the database.`
      )
    ) {
      return;
    }
    try {
      await api(`/api/admin/orders/${id}`, { method: "DELETE" });
      setMessage("Order deleted.");
      load();
    } catch (err) {
      setMessage(err.message || "Delete failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Cash on Delivery orders with size, color, and fulfillment status."
      />
      {message ? (
        <p className="mb-4 rounded-md bg-[#FAF3E8] px-3 py-2 text-sm">{message}</p>
      ) : null}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search order #, customer, product…"
          className="min-w-0 w-full rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm sm:flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm sm:w-auto"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatOrderStatus(s)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={load}
          className="w-full rounded-md bg-[#4A250F] px-4 py-2 text-sm text-[#FAF3E8] sm:w-auto"
        >
          Filter
        </button>
      </div>
      <div className="grid gap-3 2xl:hidden">
        {loading ? (
          <p className="rounded-xl border border-[#E4D2BA] bg-white px-4 py-6 text-sm text-[#765236]">
            Loading orders…
          </p>
        ) : orders.length === 0 ? (
          <p className="rounded-xl border border-[#E4D2BA] bg-white px-4 py-6 text-sm text-[#765236]">
            No orders found.
          </p>
        ) : (
          orders.map((o) => {
            const primary = o.items?.[0];
            const extra = Math.max(0, (o.items?.length || 0) - 1);
            const customerName = o.customer?.name || "Unknown customer";
            return (
              <article
                key={o._id}
                className="min-w-0 rounded-xl border border-[#E4D2BA] bg-white p-4"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-all font-semibold text-[#4A250F]">
                      {o.orderNumber}
                    </h2>
                    {o.customerRef?._id ? (
                      <Link
                        to={`/customers/${o.customerRef._id}`}
                        className="block truncate text-sm text-[#A87943] hover:underline"
                      >
                        {customerName}
                      </Link>
                    ) : (
                      <p className="truncate text-sm">{customerName}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FAF3E8] px-2.5 py-1 text-xs font-medium text-[#765236]">
                    {formatOrderStatus(o.status)}
                  </span>
                </div>

                <dl className="mt-4 grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-xs text-[#765236]">Phone</dt>
                    <dd className="break-words">{o.customer?.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#765236]">Date</dt>
                    <dd>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "—"}
                    </dd>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <dt className="text-xs text-[#765236]">Product</dt>
                    <dd className="break-words">
                      {primary?.name || "—"}
                      {extra ? ` +${extra} more` : ""}
                      {primary?.size ? ` · ${primary.size}` : ""}
                      {primary?.color ? ` · ${primary.color}` : ""}
                      {` · Qty ${o.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#765236]">Payment</dt>
                    <dd className="capitalize">
                      {o.paymentMethod || "—"} · {o.paymentStatus || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#765236]">Total</dt>
                    <dd className="font-semibold">{formatPKR(o.total)}</dd>
                  </div>
                </dl>

                <label className="mt-4 block text-xs text-[#765236]">
                  Update status
                  <select
                    value={
                      o.status === "pending" || o.status === "confirmed"
                        ? "order_placed"
                        : o.status
                    }
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="mt-1 w-full rounded border border-[#D9BFA0] bg-white px-2 py-2 text-sm text-[#1F1A17]"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {formatOrderStatus(s)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-4 flex items-center justify-between border-t border-[#F0E4D4] pt-3">
                  <Link to={`/orders/${o._id}`} className="text-sm font-medium text-[#A87943]">
                    View order
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeOrder(o._id, o.orderNumber)}
                    className="text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white 2xl:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-3 py-3">Order ID</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Size</th>
              <th className="px-3 py-3">Color</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-[#765236]">
                  Loading orders…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-6 text-[#765236]">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const primary = o.items?.[0];
                const extra = Math.max(0, (o.items?.length || 0) - 1);
                return (
                  <tr key={o._id} className="border-b border-[#F0E4D4] align-top">
                    <td className="px-3 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-3 py-3">
                      {o.customerRef?._id ? (
                        <Link
                          to={`/customers/${o.customerRef._id}`}
                          className="text-[#A87943] hover:underline"
                        >
                          {o.customer?.name}
                        </Link>
                      ) : (
                        o.customer?.name
                      )}
                    </td>
                    <td className="px-3 py-3">{o.customer?.phone}</td>
                    <td className="px-3 py-3">
                      {primary?.name || "—"}
                      {extra ? (
                        <span className="block text-xs text-[#765236]">
                          +{extra} more
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{primary?.size || "—"}</td>
                    <td className="px-3 py-3">{primary?.color || "—"}</td>
                    <td className="px-3 py-3">
                      {o.items?.reduce((s, i) => s + i.quantity, 0) || 0}
                    </td>
                    <td className="px-3 py-3">{formatPKR(o.total)}</td>
                    <td className="px-3 py-3 capitalize">
                      {o.paymentMethod}
                      <span className="block text-xs text-[#765236]">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={
                          o.status === "pending" || o.status === "confirmed"
                            ? "order_placed"
                            : o.status
                        }
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="rounded border border-[#D9BFA0] px-2 py-1 text-xs"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {formatOrderStatus(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 space-y-1">
                      <Link
                        to={`/orders/${o._id}`}
                        className="block text-[#A87943]"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeOrder(o._id, o.orderNumber)}
                        className="block text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
