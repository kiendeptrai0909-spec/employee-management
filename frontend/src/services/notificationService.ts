import api from "./api";

export const getAllNotifications = () => api.get("/notifications");
