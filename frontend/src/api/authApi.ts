import api from "../services/api";
import type { LoginRequest, LoginResponse } from "./types";

export function login(req: LoginRequest) {
  return api.post<{ success: boolean; message: string; data: LoginResponse }>("/auth/login", req);
}
