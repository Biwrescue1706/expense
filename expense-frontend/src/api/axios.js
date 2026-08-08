// src/api/axios.js

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");

            // URL ของ API ที่ทำให้ 401
            const url = error.config?.url || "";

            // ถ้าเป็น /auth/profile
            // ห้าม redirect เพราะ PublicRoute
            // ใช้ 401 เพื่อเช็กว่ายัง Login หรือไม่
            if (!url.includes("/auth/profile")) {

                if (window.location.pathname !== "/") {

                    window.location.href = "/";

                }

            }

        }

        return Promise.reject(error);

    }
);

export default api;