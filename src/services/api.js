// In development Vite exposes VITE_API_URL from .env.local
// In production Vercel injects it as a build-time env var
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data
      ? Object.values(data).flat().join(" ")
      : `Error ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE}/user/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function register(email, password, name) {
  const res = await fetch(`${BASE}/user/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return handleResponse(res);
}

export async function getMe(token) {
  const res = await fetch(`${BASE}/user/me/`, { headers: authHeaders(token) });
  return handleResponse(res);
}

// ── Recipes ───────────────────────────────────────────────────────────────────

export async function getRecipes(token, filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `${BASE}/recipe/recipes/${params ? "?" + params : ""}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  return handleResponse(res);
}

export async function getRecipe(token, id) {
  const res = await fetch(`${BASE}/recipe/recipes/${id}/`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function createRecipe(token, data) {
  const res = await fetch(`${BASE}/recipe/recipes/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateRecipe(token, id, data) {
  const res = await fetch(`${BASE}/recipe/recipes/${id}/`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteRecipe(token, id) {
  const res = await fetch(`${BASE}/recipe/recipes/${id}/`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete recipe.");
}

export async function uploadRecipeImage(token, id, file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${BASE}/recipe/recipes/${id}/upload-image/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
    body: form,
  });
  return handleResponse(res);
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export async function getTags(token) {
  const res = await fetch(`${BASE}/recipe/tags/`, { headers: authHeaders(token) });
  return handleResponse(res);
}

// ── Ingredients ───────────────────────────────────────────────────────────────

export async function getIngredients(token) {
  const res = await fetch(`${BASE}/recipe/ingredients/`, { headers: authHeaders(token) });
  return handleResponse(res);
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(token, recipeId) {
  const res = await fetch(`${BASE}/recipe/recipes/${recipeId}/comments/`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function createComment(token, recipeId, body) {
  const res = await fetch(`${BASE}/recipe/recipes/${recipeId}/comments/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ body }),
  });
  return handleResponse(res);
}

export async function deleteComment(token, recipeId, commentId) {
  const res = await fetch(
    `${BASE}/recipe/recipes/${recipeId}/comments/${commentId}/`,
    { method: "DELETE", headers: authHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to delete comment.");
}
