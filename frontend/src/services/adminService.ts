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

export const getRoles = async () => {
  try {
    return await api.get("/roles");
  } catch {
    const usersRes = await api.get("/admin/users");
    const users = Array.isArray(usersRes.data?.data) ? usersRes.data.data : [];
    const roleMap = new Map<number, { id: number; name: string; description?: string }>();

    users.forEach((u: { roleId?: number; roleName?: string }) => {
      if (typeof u.roleId === "number" && u.roleName) {
        roleMap.set(u.roleId, { id: u.roleId, name: u.roleName });
      }
    });

    return {
      ...usersRes,
      data: {
        success: true,
        message: "Roles inferred from users",
        data: Array.from(roleMap.values()),
      },
    };
  }
};
