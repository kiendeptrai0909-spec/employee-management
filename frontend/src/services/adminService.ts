import api from "./api";

export const getAllUsers = () => api.get("/admin/users");
export const createUser = (payload: {
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
}) => api.post("/admin/users", payload);
export const updateUser = (id: number, payload: Record<string, unknown>) =>
  api.put(`/admin/users/${id}`, payload);
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export const getDepartments = () => api.get("/departments");
export const createDepartment = (payload: { name: string; description?: string }) =>
  api.post("/departments", payload);
export const updateDepartment = (id: number, payload: { name: string; description?: string }) =>
  api.put(`/departments/${id}`, payload);
export const deleteDepartment = (id: number) => api.delete(`/departments/${id}`);

export const getPositions = () => api.get("/positions");
export const createPosition = (payload: { name: string; description?: string }) =>
  api.post("/positions", payload);
export const updatePosition = (id: number, payload: { name: string; description?: string }) =>
  api.put(`/positions/${id}`, payload);
export const deletePosition = (id: number) => api.delete(`/positions/${id}`);

export const getRoles = () => api.get("/roles");

// ── Admin: Leave approvals ──────────────────────────────────────────────────
export const getAllLeaveRequests = () => api.get("/leaves");
export const updateLeaveStatus = (id: number, status: string) =>
  api.put(`/leaves/${id}/status`, null, { params: { status } });

// ── Admin: Attendance report ────────────────────────────────────────────────
export const getAllAttendance = () => api.get("/attendance");
