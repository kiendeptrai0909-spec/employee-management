import api from "./api";

export interface LeaveRequestPayload {
  userId: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
}

export const getMyLeaveRequests = (userId: number) =>
  api.get(`/leaves/user/${userId}`);

export const createLeaveRequest = (payload: LeaveRequestPayload) =>
  api.post("/leaves", payload);
