export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserDTO {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
  status: string;
  roleId: number;
  roleName: string;
  departmentId: number | null;
  departmentName: string | null;
  positionId: number | null;
  positionName: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  roleId: number;
  departmentId?: number | null;
  positionId?: number | null;
}

export interface UserUpdateRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  status?: string;
  roleId?: number;
  departmentId?: number | null;
  positionId?: number | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  roleName: string;
  roleId: number;
  departmentName: string | null;
  departmentId: number | null;
  positionName: string | null;
  positionId: number | null;
}

export interface DepartmentDTO {
  id: number;
  name: string;
  description: string | null;
}

export interface PositionDTO {
  id: number;
  name: string;
  description: string | null;
}

export interface RoleDTO {
  id: number;
  name: string;
  description: string | null;
}
