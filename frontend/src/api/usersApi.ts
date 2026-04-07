import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type { UserCreateRequest, UserDTO, UserUpdateRequest } from "./types";

const BASE = "/api/admin/users";

export function fetchUsers() {
  return apiGet<UserDTO[]>(BASE);
}

export function fetchUser(id: number) {
  return apiGet<UserDTO>(`${BASE}/${id}`);
}

export function createUser(req: UserCreateRequest) {
  return apiPost<UserCreateRequest, UserDTO>(BASE, req);
}

export function updateUser(id: number, req: UserUpdateRequest) {
  return apiPut<UserUpdateRequest, UserDTO>(`${BASE}/${id}`, req);
}

export function deleteUser(id: number) {
  return apiDelete(`${BASE}/${id}`);
}
