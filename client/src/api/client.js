// CHANGE ME (optional): set VITE_API_URL in client/.env if the API is
// on a different domain than the frontend. Empty string means
// "same origin" — the normal setup, since Express serves both.
const API_BASE = import.meta.env.VITE_API_URL || "";

function authHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) Object.assign(headers, authHeaders());

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data.error) message = data.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (password) => request("/api/auth/login", { method: "POST", body: { password } }),

  getProfile: () => request("/api/profile"),
  updateProfile: (data) => request("/api/profile", { method: "PUT", body: data, auth: true }),
  uploadProfilePhoto: (file) => {
    const form = new FormData();
    form.append("photo", file);
    return request("/api/profile/photo", { method: "POST", body: form, isForm: true, auth: true });
  },

  getNav: () => request("/api/nav"),
  addNav: (label) => request("/api/nav", { method: "POST", body: { label }, auth: true }),
  patchNav: (id, patch) => request(`/api/nav/${id}`, { method: "PATCH", body: patch, auth: true }),
  deleteNav: (id) => request(`/api/nav/${id}`, { method: "DELETE", auth: true }),

  getCollection: (key) => request(`/api/${key}`),
  addCollectionItem: (key, data, file) => {
    if (file) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
      form.append("image", file);
      return request(`/api/${key}`, { method: "POST", body: form, isForm: true, auth: true });
    }
    return request(`/api/${key}`, { method: "POST", body: data, auth: true });
  },
  patchCollectionItem: (key, id, patch, file) => {
    if (file) {
      const form = new FormData();
      Object.entries(patch).forEach(([k, v]) => form.append(k, v));
      form.append("image", file);
      return request(`/api/${key}/${id}`, { method: "PATCH", body: form, isForm: true, auth: true });
    }
    return request(`/api/${key}/${id}`, { method: "PATCH", body: patch, auth: true });
  },
  deleteCollectionItem: (key, id) => request(`/api/${key}/${id}`, { method: "DELETE", auth: true }),
};
