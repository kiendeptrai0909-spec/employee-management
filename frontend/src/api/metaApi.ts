import api from "../services/api";
import type { DepartmentDTO, PositionDTO, RoleDTO } from "./types";

export function fetchDepartments() {
  return api.get<{ success: boolean; message: string; data: DepartmentDTO[] }>("/departments");
}

export function fetchPositions() {
  return api.get<{ success: boolean; message: string; data: PositionDTO[] }>("/positions");
}

export function fetchRoles() {
  return api.get<{ success: boolean; message: string; data: RoleDTO[] }>("/roles");
}
