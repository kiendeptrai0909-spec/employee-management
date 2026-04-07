import { apiGet } from "./client";
import type { DepartmentDTO, PositionDTO, RoleDTO } from "./types";

export function fetchDepartments() {
  return apiGet<DepartmentDTO[]>("/api/departments");
}

export function fetchPositions() {
  return apiGet<PositionDTO[]>("/api/positions");
}

export function fetchRoles() {
  return apiGet<RoleDTO[]>("/api/roles");
}
