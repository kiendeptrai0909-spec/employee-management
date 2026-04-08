import api from "./api";

export const getMyPayroll = (userId: number) =>
  api.get(`/payroll/user/${userId}`);
