import api from "./api";

export const getMyProfile = (id: number) => api.get(`/users/profile/${id}`);
export const updateMyProfile = (id: number, payload: Record<string, unknown>) =>
  api.put(`/users/profile/${id}`, payload);
