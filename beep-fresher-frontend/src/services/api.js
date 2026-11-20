import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const jobService = {
  getJobs: async (params) => {
    const { data } = await api.get("/jobs", { params });
    return data;
  },

  getJob: async (id) => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/stats");
    return data;
  },

  refresh: async () => {
    const { data } = await api.post(
      "/admin/refresh",
      {},
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    return data;
  },
};
