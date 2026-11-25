import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import ProductImageFields from "../../components/admin/ProductImageFields";
import { api } from "../../api/admin/client";

const defaultSizes = () => [
  { name: "Small", price: 1100, stock: 25, compareAt: "" },
  { name: "Medium", price: 1300, stock: 20, compareAt: "" },
  { name: "Large", price: 1400, stock: 15, compareAt: "" },
];

const empty = {
  name: "",
  slug: "",
  category: "Storage",
  size: "",
  price: 1100,
  compareAt: "",
  discount: 0,
  stock: 0,
  status: "active",
  image: "",
  gallery: [],
  description: "",
  details: "",
  sizes: defaultSizes(),
  colors: [{ name: "", hex: "", image: "" }],
};

export default function ProductForm() {
  const { id } = useParams();
  const location = useLocation();
  const isNew = location.pathname.endsWith("/products/new") || !id;
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
          price: p.price ?? 1100,
          compareAt: p.compareAt ?? "",
          discount: p.discount ?? 0,
          stock: p.stock ?? 0,
          status: p.status || "active",
          image: p.image || "",
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          description: p.description || "",
          details: (p.details || []).join(", "),
          size: p.size || "",
          sizes: Array.isArray(p.sizes)
            ? p.sizes.map((s) => ({
                name: s.name,
                price: s.price,
                stock: s.stock ?? 0,
                compareAt: s.compareAt ?? "",
              }))
            : [],
          colors:
            p.colors?.length > 0
              ? p.colors.map((c) => ({
                  name: c.name || "",
                  hex: c.hex || "",
                  image: c.image || "",
                }))
              : [{ name: "", hex: "", image: "" }],
        });
      })
      .catch((err) => setError(err.message || "Could not load product"));
  }, [id, isNew]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateSize = (index, key, value) => {
    setForm((prev) => {
      const sizes = prev.sizes.map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      );
      return { ...prev, sizes, price: sizes[0]?.price || prev.price };
    });
  };

  const updateColor = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === index ? { ...c, [key]: value } : c
      ),
    }));
  };

  const addColor = () =>
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "", image: "" }],
    }));

  const removeColor = (index) =>
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const sizes = form.sizes.map((s) => ({
      name: s.name,
      price: Number(s.price) || 0,
      stock: Number(s.stock) || 0,
      compareAt: Number(s.compareAt) || undefined,
    }));
    const colors = form.colors
      .filter((c) => c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        hex: c.hex.trim(),
        image: c.image.trim(),
      }));

    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      size: form.size || "",
      price: sizes[0]?.price || Number(form.price) || 0,
      compareAt: Number(form.compareAt) || undefined,
      discount: Number(form.discount) || 0,
      stock: sizes.length
        ? sizes.reduce((sum, s) => sum + (s.stock || 0), 0)
        : Number(form.stock) || 0,
      status: form.status,
      image: form.image,
      gallery: (Array.isArray(form.gallery) ? form.gallery : [])
        .map((s) => String(s).trim())
        .filter(Boolean),
      details: form.details
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description,
      sizes,
      colors,
    };
    if (!payload.image) {
      setError("Primary image is required");
      setSaving(false);
      return;
    }
    if (!payload.gallery.length) payload.gallery = [payload.image];
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
        subtitle="Manage sizes, prices, and colors for each product."
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
          ["discount", "Discount %"],
          ["details", "Details (comma-separated)"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block text-[#765236]">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
              required={["name", "slug"].includes(key)}
            />
          </label>
        ))}

        <ProductImageFields
          image={form.image}
          gallery={form.gallery}
          onImageChange={(value) => set("image", value)}
          onGalleryChange={(value) => set("gallery", value)}
        />

        {form.sizes.length ? (
          <div className="rounded-lg border border-[#E4D2BA] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#4A250F]">
              Bag size pricing (S / M / L)
            </h3>
            <div className="space-y-3">
              {form.sizes.map((size, index) => (
                <div
                  key={size.name}
                  className="grid gap-2 sm:grid-cols-4 sm:items-end"
                >
                  <label className="block text-sm">
                    <span className="mb-1 block text-[#765236]">Size</span>
                    <input
                      value={size.name}
                      readOnly
                      className="w-full rounded-md border border-[#D9BFA0] bg-[#FAF3E8] px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-[#765236]">Price</span>
                    <input
                      type="number"
                      min="0"
                      value={size.price}
                      onChange={(e) =>
                        updateSize(index, "price", e.target.value)
                      }
                      className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                      required
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-[#765236]">Compare at</span>
                    <input
                      type="number"
                      min="0"
                      value={size.compareAt}
                      onChange={(e) =>
                        updateSize(index, "compareAt", e.target.value)
                      }
                      className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-[#765236]">Stock</span>
                    <input
                      type="number"
                      min="0"
                      value={size.stock}
                      onChange={(e) =>
                        updateSize(index, "stock", e.target.value)
                      }
                      className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-[#765236]">
                Pouch type / label
              </span>
              <input
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
                className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                placeholder="Simple Roti Pouch"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[#765236]">Price</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[#765236]">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
              />
            </label>
          </div>
        )}

        <div className="rounded-lg border border-[#E4D2BA] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#4A250F]">Colors</h3>
            <button
              type="button"
              onClick={addColor}
              className="text-sm text-[#A87943]"
            >
              Add color
            </button>
          </div>
          <div className="space-y-3">
            {form.colors.map((color, index) => (
              <div
                key={index}
                className="grid gap-2 sm:grid-cols-[1fr_100px_1fr_auto] sm:items-end"
              >
                <label className="block text-sm">
                  <span className="mb-1 block text-[#765236]">Name</span>
                  <input
                    value={color.name}
                    onChange={(e) =>
                      updateColor(index, "name", e.target.value)
                    }
                    className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                    placeholder="e.g. Teal"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[#765236]">Hex</span>
                  <input
                    value={color.hex}
                    onChange={(e) => updateColor(index, "hex", e.target.value)}
                    className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                    placeholder="#2A8F8F"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-[#765236]">Image path</span>
                  <input
                    value={color.image}
                    onChange={(e) =>
                      updateColor(index, "image", e.target.value)
                    }
                    className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
                    placeholder="/media/bag1.jpeg"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="mb-1 text-sm text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

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
