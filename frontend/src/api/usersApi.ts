import api from "../services/api";
import type { UserCreateRequest, UserDTO, UserUpdateRequest } from "./types";

const BASE = "/admin/users";

export function fetchUsers() {
  return api.get<{ success: boolean; message: string; data: UserDTO[] }>(BASE);
}

export function fetchUser(id: number) {
  return api.get<{ success: boolean; message: string; data: UserDTO }>(`${BASE}/${id}`);
}

export function createUser(req: UserCreateRequest) {
  return api.post<{ success: boolean; message: string; data: UserDTO }>(BASE, req);
}

export function updateUser(id: number, req: UserUpdateRequest) {
  return api.put<{ success: boolean; message: string; data: UserDTO }>(`${BASE}/${id}`, req);
}

export function deleteUser(id: number) {
  return api.delete<{ success: boolean; message: string; data: null }>(`${BASE}/${id}`);
}
