import type { ApiResponse } from "./types";
import { clearCurrentUser, getAccessToken } from "../utils/authStorage";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function authHeaders(contentJson = false): Record<string, string> {
  const h: Record<string, string> = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  if (contentJson) {
    h["Content-Type"] = "application/json";
  }
  return h;
}

function redirectIfUnauthorized(status: number, path: string) {
  if (status === 401 && !path.includes("/api/auth/login")) {
    clearCurrentUser();
    window.location.assign("/");
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError("Phản hồi không phải JSON hợp lệ", res.status);
  }
  return json as ApiResponse<T>;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
  });
  const data = await parseJson<T>(res);
  redirectIfUnauthorized(res.status, path);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}

export async function apiDelete(path: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE", headers: authHeaders() });
  const data = await parseJson<null>(res);
  redirectIfUnauthorized(res.status, path);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}

export async function apiPost<TBody, TRes>(
  path: string,
  body: TBody
): Promise<ApiResponse<TRes>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });
  const data = await parseJson<TRes>(res);
  redirectIfUnauthorized(res.status, path);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}

export async function apiPut<TBody, TRes>(
  path: string,
  body: TBody
): Promise<ApiResponse<TRes>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });
  const data = await parseJson<TRes>(res);
  redirectIfUnauthorized(res.status, path);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}
