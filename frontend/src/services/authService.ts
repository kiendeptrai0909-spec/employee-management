import api from "./api";

export interface LoginPayload {
  username: string;
  password: string;
}

export const login = (payload: LoginPayload) => api.post("/auth/login", payload);
