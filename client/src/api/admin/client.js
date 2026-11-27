const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function mediaUrl(path) {
  if (!path || typeof path !== "string") return "";
  const value = path.trim();
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return value;
  return `${API_BASE}${value.startsWith("/") ? value : `/${value}`}`;
}

export function getToken() {
  return localStorage.getItem("stitchlane_admin_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("stitchlane_admin_token", token);
  else localStorage.removeItem("stitchlane_admin_token");
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

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

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/admin/media/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }
  return data;
}
