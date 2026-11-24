import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api("/api/admin/customers")
      .then((res) => setCustomers(res.data.items || res.data || []))
      .catch(() => setCustomers([]));
  }, []);

  const filtered = customers.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Shoppers and COD customer records."
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search customers…"
        className="mb-4 w-full max-w-md rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm"
      />
      <div className="overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-[#765236]">
                  No customers yet. They appear after COD checkouts.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id || c.phone} className="border-b border-[#F0E4D4]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <p>{c.phone}</p>
                    <p className="text-xs text-[#765236]">{c.email || "—"}</p>
                  </td>
                  <td className="px-4 py-3">{c.orderCount ?? 0}</td>
                  <td className="px-4 py-3 capitalize">{c.status || "active"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
