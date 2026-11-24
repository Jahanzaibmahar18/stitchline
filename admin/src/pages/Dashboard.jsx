import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { api } from "../api/client";
import { CATALOG_PRODUCTS, formatPKR } from "../data/catalog";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => {
        setError("Showing catalog baseline until API is available.");
        setStats({
          totalSales: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: CATALOG_PRODUCTS.length,
          lowStock: CATALOG_PRODUCTS.filter((p) => p.stock <= 20),
          recentOrders: [],
          statusSummary: {},
        });
      });
  }, []);

  if (!stats) {
    return <p className="text-sm text-[#765236]">Loading dashboard…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Sales, orders, and inventory at a glance."
      />
      {error ? (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sales" value={formatPKR(stats.totalSales)} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Products" value={stats.totalProducts} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#4A250F]">Recent orders</h2>
            <Link to="/orders" className="text-sm text-[#A87943]">
              View all
            </Link>
          </div>
          {stats.recentOrders?.length ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id || order.orderNumber}
                  className="flex items-center justify-between border-b border-[#F0E4D4] pb-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-[#765236]">{order.customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <p>{formatPKR(order.total)}</p>
                    <p className="capitalize text-[#A87943]">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#765236]">No orders yet.</p>
          )}
        </section>

        <section className="rounded-xl border border-[#E4D2BA] bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-[#4A250F]">
            Low stock alerts
          </h2>
          <div className="space-y-3">
            {(stats.lowStock || []).slice(0, 6).map((p) => (
              <div
                key={p.slug || p._id}
                className="flex items-center justify-between text-sm"
              >
                <span>{p.name}</span>
                <span className="font-medium text-red-700">{p.stock} left</span>
              </div>
            ))}
            {!stats.lowStock?.length ? (
              <p className="text-sm text-[#765236]">Stock levels look healthy.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
