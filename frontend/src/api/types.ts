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

  // Personal Info
  identityCard: string | null;
  temporaryAddress: string | null;
  personalEmail: string | null;

  // Work Info
  employeeCode: string | null;
  joinDate: string | null;
  contractType: string | null;
  managerId: number | null;

  // Financial Info
  basicSalary: number | null;
  allowance: number | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  taxId: string | null;
  insuranceNumber: string | null;

  // Working & Performance Info
  workSchedule: string | null;
  kpiScore: string | null;
  skills: string | null;
  educationLevel: string | null;

  // IT
  equipment: string | null;

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

  // Personal Info
  identityCard?: string;
  temporaryAddress?: string;
  personalEmail?: string;

  // Work Info
  employeeCode?: string;
  joinDate?: string;
  contractType?: string;
  managerId?: number | null;

  // Financial Info
  basicSalary?: number | null;
  allowance?: number | null;
  bankAccountNumber?: string;
  bankName?: string;
  taxId?: string;
  insuranceNumber?: string;

  // Working & Performance Info
  workSchedule?: string;
  kpiScore?: string;
  skills?: string;
  educationLevel?: string;

  // IT
  equipment?: string;

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

  // Personal Info
  identityCard?: string;
  temporaryAddress?: string;
  personalEmail?: string;

  // Work Info
  employeeCode?: string;
  joinDate?: string;
  contractType?: string;
  managerId?: number | null;

  // Financial Info
  basicSalary?: number | null;
  allowance?: number | null;
  bankAccountNumber?: string;
  bankName?: string;
  taxId?: string;
  insuranceNumber?: string;

  // Working & Performance Info
  workSchedule?: string;
  kpiScore?: string;
  skills?: string;
  educationLevel?: string;

  // IT
  equipment?: string;

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
