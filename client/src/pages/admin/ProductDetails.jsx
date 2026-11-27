import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/admin/PageHeader";
import { api, mediaUrl } from "../../api/admin/client";
import { CATALOG_PRODUCTS, formatPKR } from "../../data/admin/catalog";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api(`/api/admin/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {
        setProduct(CATALOG_PRODUCTS.find((p) => p.slug === id) || null);
      });
  }, [id]);

  if (!product) {
    return <p className="text-sm text-[#765236]">Loading product…</p>;
  }

  const category =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  return (
    <div>
      <PageHeader
        title={product.name}
        subtitle="Product details"
        actionLabel="Edit product"
        actionTo={`/products/${product._id || product.slug}/edit`}
      />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <img
          src={mediaUrl(product.image)}
          alt={product.name}
          className="h-72 w-full rounded-xl object-cover bg-[#EFE3D2]"
        />
        <div className="rounded-xl border border-[#E4D2BA] bg-white p-6 text-sm">
          <p className="text-xs uppercase tracking-wide text-[#A87943]">
            {category}
          </p>
          <p className="mt-3 text-2xl font-semibold text-[#4A250F]">
            {formatPKR(product.price)}
          </p>
          {product.sizes?.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-[#765236]">
                Size pricing
              </p>
              <ul className="space-y-1 text-[#4A250F]">
                {product.sizes.map((s) => (
                  <li key={s.name}>
                    {s.name}: {formatPKR(s.price)} · stock {s.stock}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {product.colors?.length ? (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-[#765236]">
                Colors
              </p>
              <ul className="space-y-1 text-[#4A250F]">
                {product.colors.map((c) => (
                  <li key={c.name}>
                    {c.name}
                    {c.hex ? ` (${c.hex})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="mt-4 leading-7 text-[#765236]">{product.description}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <p>Stock: {product.stock}</p>
            <p className="capitalize">Status: {product.status || "active"}</p>
            <p>Discount: {product.discount || 0}%</p>
            <p>Slug: {product.slug}</p>
          </div>
          {product.details?.length ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-[#765236]">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : null}
          <Link to="/products" className="mt-6 inline-block text-[#A87943]">
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
