import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";
import { CATEGORIES } from "../../data/admin/catalog";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = () => {
    api("/api/admin/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories(CATEGORIES));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api("/api/admin/categories", { method: "POST", body: form });
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await api(`/api/admin/categories/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Storage and Kitchen collections for StitchLane."
      />
      <form
        onSubmit={create}
        className="mb-6 grid max-w-xl gap-3 rounded-xl border border-[#E4D2BA] bg-white p-5"
      >
        <input
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-md border border-[#D9BFA0] px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="rounded-md border border-[#D9BFA0] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-[#4A250F] px-4 py-2 text-sm text-[#FAF3E8]"
        >
          Add category
        </button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <div
            key={c._id || c.slug}
            className="rounded-xl border border-[#E4D2BA] bg-white p-5"
          >
            <h2 className="text-lg font-semibold text-[#4A250F]">{c.name}</h2>
            <p className="mt-1 text-sm text-[#765236]">{c.description}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-[#A87943]">
              {c.productCount != null
                ? `${c.productCount} products`
                : c.slug}
            </p>
            {c._id ? (
              <button
                type="button"
                onClick={() => remove(c._id)}
                className="mt-4 text-sm text-red-700"
              >
                Delete
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
