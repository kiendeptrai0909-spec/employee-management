import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

/** Backend Spring trả body dạng { success, message, data } */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function unwrapApiData<T>(res: { data: ApiEnvelope<T> }): T {
  return res.data.data;
}

export default api;
