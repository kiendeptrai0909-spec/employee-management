import api from "./api";

export const getAllDocuments = () => api.get("/documents");
