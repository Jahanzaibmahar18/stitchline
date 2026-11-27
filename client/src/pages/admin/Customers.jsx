import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { formatPKR } from "../../data/admin/catalog";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = (search = q) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    api(`/api/admin/customers?${params}`)
      .then((res) => setCustomers(res.data.items || res.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load("");
  }, []);

  const removeCustomer = async (id, name) => {
    if (
      !confirm(
        `Delete customer ${name}? Related orders will be kept but unlinked.`
      )
    ) {
      return;
    }
    try {
      await api(`/api/admin/customers/${id}`, { method: "DELETE" });
      setMessage("Customer deleted.");
      load();
    } catch (err) {
      setMessage(err.message || "Delete failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Permanent customer records created from COD checkouts."
      />
      {message ? (
        <p className="mb-4 rounded-md bg-[#FAF3E8] px-3 py-2 text-sm">{message}</p>
      ) : null}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search by name, phone, or customer ID…"
          className="min-w-0 w-full rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm sm:flex-1"
        />
        <button
          type="button"
          onClick={() => load()}
          className="w-full rounded-md bg-[#4A250F] px-4 py-2 text-sm text-[#FAF3E8] sm:w-auto"
        >
          Search
        </button>
      </div>
      <div className="grid gap-3 2xl:hidden">
        {loading ? (
          <p className="rounded-xl border border-[#E4D2BA] bg-white px-4 py-6 text-sm text-[#765236]">
            Loading customers…
          </p>
        ) : customers.length === 0 ? (
          <p className="rounded-xl border border-[#E4D2BA] bg-white px-4 py-6 text-sm text-[#765236]">
            No customers yet. They appear after COD checkouts.
          </p>
        ) : (
          customers.map((c) => (
            <article
              key={c._id}
              className="min-w-0 rounded-xl border border-[#E4D2BA] bg-white p-4"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words font-semibold text-[#4A250F]">
                    {c.name}
                  </h2>
                  <p className="break-all text-xs text-[#765236]">
                    {c.customerId || c._id}
                  </p>
                </div>
                <Link
                  to={`/customers/${c._id}`}
                  className="shrink-0 text-sm text-[#A87943]"
                >
                  Profile
                </Link>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="min-w-0">
                  <dt className="text-xs text-[#765236]">Phone</dt>
                  <dd className="break-words">{c.phone || "—"}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-[#765236]">Email</dt>
                  <dd className="break-all text-[#765236]">
                    {c.email?.includes("@customers.stitchlane.local")
                      ? "—"
                      : c.email || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#765236]">City</dt>
                  <dd className="break-words">{c.city || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#765236]">Orders</dt>
                  <dd>{c.totalOrders ?? c.orderCount ?? 0}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#765236]">Total spent</dt>
                  <dd>{formatPKR(c.totalSpent || 0)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#765236]">Last order</dt>
                  <dd>
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString()
                      : "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-[#F0E4D4] pt-3 text-right">
                <button
                  type="button"
                  onClick={() => removeCustomer(c._id, c.name)}
                  className="text-sm text-red-700"
                >
                  Delete customer
                </button>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white 2xl:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total spent</th>
              <th className="px-4 py-3">Last order</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-[#765236]">
                  Loading customers…
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-[#765236]">
                  No customers yet. They appear after COD checkouts.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-b border-[#F0E4D4]">
                  <td className="px-4 py-3 font-medium">
                    {c.customerId || c._id}
                  </td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3 text-[#765236]">
                    {c.email?.includes("@customers.stitchlane.local")
                      ? "—"
                      : c.email || "—"}
                  </td>
                  <td className="px-4 py-3">{c.city || "—"}</td>
                  <td className="px-4 py-3">{c.totalOrders ?? c.orderCount ?? 0}</td>
                  <td className="px-4 py-3">
                    {formatPKR(c.totalSpent || 0)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 space-y-1">
                    <Link
                      to={`/customers/${c._id}`}
                      className="block text-[#A87943]"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeCustomer(c._id, c.name)}
                      className="block text-xs text-red-700"
                    >
                      Delete
                    </button>
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
