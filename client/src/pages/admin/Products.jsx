import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { CATALOG_PRODUCTS, formatPKR } from "../../data/admin/catalog";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);

  const load = (term = q) => {
    setLoading(true);
    api(`/api/admin/products?search=${encodeURIComponent(term)}`)
      .then((res) => setProducts(res.data.items || res.data))
      .catch(() => setProducts(CATALOG_PRODUCTS))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const term = searchParams.get("search") || "";
    setQ(term);
    load(term);
  }, [searchParams]);

  const remove = async (idOrSlug) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/api/admin/products/${idOrSlug}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = (Array.isArray(products) ? products : []).filter((p) => {
    const category =
      typeof p.category === "object" ? p.category?.name || "" : p.category || "";
    return `${p.name || ""} ${category} ${p.slug || ""}`
      .toLowerCase()
      .includes((q || "").toLowerCase());
  });

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage StitchLane catalog, prices, and variations."
        actionLabel="Add product"
        actionTo="/products/new"
      />
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search products…"
          className="w-full max-w-md rounded-md border border-[#D9BFA0] bg-white px-3 py-2.5 text-sm"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id || p.slug} className="border-b border-[#F0E4D4]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="h-12 w-12 rounded object-cover bg-[#EFE3D2]"
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[#765236]">
                          {p.colors?.length
                            ? `${p.colors.length} color${p.colors.length > 1 ? "s" : ""}`
                            : p.size || "S / M / L"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {typeof p.category === "object"
                      ? p.category?.name
                      : p.category}
                  </td>
                  <td className="px-4 py-3">
                    {p.sizes?.length
                      ? `${formatPKR(p.sizes[0].price)} – ${formatPKR(
                          p.sizes[p.sizes.length - 1].price
                        )}`
                      : formatPKR(p.price)}
                  </td>
                  <td className="px-4 py-3">{p.stock ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{p.status || "active"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/products/${p._id || p.slug}`}
                        className="text-[#765236]"
                      >
                        View
                      </Link>
                      <Link
                        to={`/products/${p._id || p.slug}/edit`}
                        className="text-[#A87943]"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(p._id || p.slug)}
                        className="text-red-700"
                      >
                        Delete
                      </button>
                    </div>
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
