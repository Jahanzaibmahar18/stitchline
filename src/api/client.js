const API_BASE = import.meta.env.VITE_API_URL || "";

export function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  return `${API_BASE}${path}`;
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function mapProduct(p) {
  if (!p) return null;
  const categoryName =
    typeof p.category === "object" ? p.category?.name : p.category;
  return {
    id: p.slug || p.id,
    _id: p._id,
    name: p.name,
    category: categoryName || "Storage",
    size: p.size || "",
    price: p.price,
    compareAt: p.compareAt,
    discount: p.discount,
    image: mediaUrl(p.image),
    gallery: (p.gallery || [p.image]).map(mediaUrl),
    description: p.description || "",
    details: p.details || [],
    stock: p.stock,
    status: p.status,
  };
}

export const mapApiProduct = mapProduct;
