import api from "./api";

export const getMyProfile = (id: number) => api.get(`/users/profile/${id}`);
export const updateMyProfile = (id: number, payload: Record<string, unknown>) =>
  api.put(`/users/profile/${id}`, payload);
export const changePassword = (
  id: number,
  payload: { currentPassword: string; newPassword: string }
) => api.put(`/users/profile/${id}/password`, payload);
