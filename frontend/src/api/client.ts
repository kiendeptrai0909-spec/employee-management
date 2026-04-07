import type { ApiResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

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
    headers: { Accept: "application/json" },
  });
  const data = await parseJson<T>(res);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}

export async function apiDelete(path: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  const data = await parseJson<null>(res);
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
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await parseJson<TRes>(res);
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
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await parseJson<TRes>(res);
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || res.statusText, res.status, data.data);
  }
  return data;
}
