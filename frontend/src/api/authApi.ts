import { apiPost } from "./client";
import type { LoginRequest, LoginResponse } from "./types";

export function login(req: LoginRequest) {
  return apiPost<LoginRequest, LoginResponse>("/api/auth/login", req);
}
