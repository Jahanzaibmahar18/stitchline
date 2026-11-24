import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";
import { CATALOG_PRODUCTS } from "../data/catalog";

const empty = {
  name: "",
  slug: "",
  category: "Storage",
  size: "",
  price: "",
  compareAt: "",
  discount: 0,
  stock: 0,
  status: "active",
  image: "",
  gallery: "",
  description: "",
  details: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api(`/api/admin/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          category: p.category?.name || p.category || "Storage",
          size: p.size || "",
          price: p.price ?? "",
          compareAt: p.compareAt ?? "",
          discount: p.discount ?? 0,
          stock: p.stock ?? 0,
          status: p.status || "active",
          image: p.image || "",
          gallery: (p.gallery || []).join(", "),
          description: p.description || "",
          details: (p.details || []).join(", "),
        });
      })
      .catch(() => {
        const local = CATALOG_PRODUCTS.find((p) => p.slug === id);
        if (local) {
          setForm({
            ...local,
            gallery: local.gallery.join(", "),
            details: local.details.join(", "),
          });
        }
      });
  }, [id, isNew]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      compareAt: Number(form.compareAt) || undefined,
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      gallery: form.gallery
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      details: form.details
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (isNew) {
        await api("/api/admin/products", { method: "POST", body: payload });
      } else {
        await api(`/api/admin/products/${id}`, {
          method: "PUT",
          body: payload,
        });
      }
      navigate("/products");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={isNew ? "Add product" : "Edit product"}
        subtitle="Use existing StitchLane product fields and image paths."
      />
      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <form
        onSubmit={onSubmit}
        className="grid max-w-3xl gap-4 rounded-xl border border-[#E4D2BA] bg-white p-6"
      >
        {[
          ["name", "Name"],
          ["slug", "Slug"],
          ["category", "Category"],
          ["size", "Size"],
          ["price", "Price"],
          ["compareAt", "Compare at"],
          ["discount", "Discount %"],
          ["stock", "Stock"],
          ["image", "Primary image URL"],
          ["gallery", "Gallery (comma-separated)"],
          ["details", "Details (comma-separated)"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block text-[#765236]">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
              required={["name", "slug", "price", "image"].includes(key)}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="mb-1 block text-[#765236]">Status</span>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[#765236]">Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#4A250F] px-4 py-3 text-sm font-semibold text-[#FAF3E8] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}
