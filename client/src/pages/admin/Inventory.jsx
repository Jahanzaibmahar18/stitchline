import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { CATALOG_PRODUCTS } from "../../data/admin/catalog";

export default function Inventory() {
  const [items, setItems] = useState([]);

  const load = () => {
    api("/api/admin/products")
      .then((res) => setItems(res.data.items || res.data || []))
      .catch(() => setItems(CATALOG_PRODUCTS));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStock = async (idOrSlug, stock) => {
    const value = Math.max(0, Number(stock) || 0);
    try {
      await api(`/api/admin/products/${idOrSlug}/stock`, {
        method: "PATCH",
        body: { stock: value },
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Track stock and low-inventory alerts."
      />
      <div className="overflow-x-auto rounded-xl border border-[#E4D2BA] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#E4D2BA] bg-[#FAF3E8] text-xs uppercase tracking-wide text-[#765236]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Alert</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id || p.slug} className="border-b border-[#F0E4D4]">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.stock <= 10 ? (
                    <span className="text-red-700">Low</span>
                  ) : p.stock <= 20 ? (
                    <span className="text-amber-700">Watch</span>
                  ) : (
                    <span className="text-green-700">OK</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const stock = new FormData(e.currentTarget).get("stock");
                      updateStock(p._id || p.slug, stock);
                    }}
                  >
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      defaultValue={p.stock}
                      className="w-24 rounded-md border border-[#D9BFA0] px-2 py-1"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-[#4A250F] px-3 py-1 text-[#FAF3E8]"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
