import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { formatPKR } from "../../data/admin/catalog";
import { formatOrderStatus } from "../../utils/admin/orderStatus";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/api/admin/customers/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [id]);

  const removeCustomer = async () => {
    if (
      !confirm(
        `Delete customer ${data.customer.name}? Related orders will be kept but unlinked.`
      )
    ) {
      return;
    }
    try {
      await api(`/api/admin/customers/${id}`, { method: "DELETE" });
      navigate("/customers");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!data?.customer) {
    return <p className="text-sm text-[#765236]">Loading customer…</p>;
  }

  const { customer, orders } = data;
  const emailDisplay = customer.email?.includes("@customers.stitchlane.local")
    ? "—"
    : customer.email || "—";

  return (
    <div>
      <PageHeader
        title={customer.name}
        subtitle={`${customer.customerId} · Customer profile`}
      />
      {message ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5 text-sm lg:col-span-1">
          <h2 className="mb-3 font-semibold text-[#4A250F]">Details</h2>
          <dl className="space-y-2 text-[#765236]">
            <div>
              <dt className="text-xs uppercase tracking-wide">Customer ID</dt>
              <dd className="text-[#4A250F]">{customer.customerId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Phone</dt>
              <dd className="text-[#4A250F]">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Email</dt>
              <dd className="text-[#4A250F]">{emailDisplay}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Address</dt>
              <dd className="text-[#4A250F]">
                {customer.address || "—"}
                {customer.city ? `, ${customer.city}` : ""}
                {customer.postalCode ? ` · ${customer.postalCode}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Total orders</dt>
              <dd className="text-[#4A250F]">{customer.totalOrders || 0}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Total spent</dt>
              <dd className="text-[#4A250F]">
                {formatPKR(customer.totalSpent || 0)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">First order</dt>
              <dd className="text-[#4A250F]">
                {customer.firstOrderAt
                  ? new Date(customer.firstOrderAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide">Last order</dt>
              <dd className="text-[#4A250F]">
                {customer.lastOrderAt
                  ? new Date(customer.lastOrderAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={removeCustomer}
            className="mt-5 rounded-md border border-red-300 px-4 py-2 text-red-700"
          >
            Delete customer
          </button>
        </section>

        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-[#4A250F]">Order history</h2>
          {!orders?.length ? (
            <p className="text-sm text-[#765236]">No orders linked.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[#E4D2BA] text-xs uppercase tracking-wide text-[#765236]">
                  <tr>
                    <th className="px-2 py-2">Order</th>
                    <th className="px-2 py-2">Items</th>
                    <th className="px-2 py-2">Total</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-[#F0E4D4]">
                      <td className="px-2 py-3">
                        <Link
                          to={`/orders/${o._id}`}
                          className="text-[#A87943]"
                        >
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-2 py-3">
                        {o.items
                          ?.map(
                            (i) =>
                              `${i.name}${i.size ? ` (${i.size}` : ""}${
                                i.color ? `, ${i.color}` : ""
                              }${i.size || i.color ? ")" : ""} ×${i.quantity}`
                          )
                          .join("; ")}
                      </td>
                      <td className="px-2 py-3">{formatPKR(o.total)}</td>
                      <td className="px-2 py-3">
                        {formatOrderStatus(o.status)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
