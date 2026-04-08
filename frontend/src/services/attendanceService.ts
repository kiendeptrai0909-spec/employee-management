import api from "./api";

export const getMyAttendance = (userId: number) =>
  api.get(`/attendance/user/${userId}`);

export const checkIn = (userId: number) =>
  api.post(`/attendance/check-in/${userId}`);

export const checkOut = (userId: number) =>
  api.post(`/attendance/check-out/${userId}`);
