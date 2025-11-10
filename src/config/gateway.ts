import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
    _retry?: boolean;
}


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL,
    timeout: 180000,
    headers: { "Content-Type": "application/json" }
})

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Khi có token mới → gọi lại tất cả request đang chờ
function onTokenRefreshed(newToken: string) {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
    refreshSubscribers.push(callback);
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: AxiosError): Promise<any> => {
        // const originalRequest = error.config as AxiosRequestConfigWithRetry;

        // if (error.response?.status === 401 && !originalRequest._retry) {
        //     originalRequest._retry = true;

        //     if (isRefreshing) {
        //         return new Promise((resolve) => {
        //             addRefreshSubscriber((newToken) => {
        //                 if (originalRequest.headers) {
        //                     originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //                 }
        //                 resolve(api(originalRequest));
        //             });
        //         });
        //     }

        //     isRefreshing = true;

        //     try {
        //         const refreshToken = localStorage.getItem("refresh_token");
        //         if (!refreshToken) throw new Error("No refresh token");

        //         const res = await axios.post<{ accessToken: string }>(
        //             `${api.defaults.baseURL}/auth/refresh`,
        //             { refreshToken }
        //         );
        //         const newToken = res.data.accessToken;

        //         localStorage.setItem("token", newToken);
        //         onTokenRefreshed(newToken);

        //         if (originalRequest.headers) {
        //             originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //         }
        //         return api(originalRequest);
        //     } catch (refreshErr) {
        //         console.error("Refresh token failed:", refreshErr);
        //         localStorage.removeItem("token");
        //         localStorage.removeItem("refresh_token");
        //         window.location.href = "/login";
        //         return Promise.reject(refreshErr);
        //     } finally {
        //         isRefreshing = false;
        //     }
        // }

        return Promise.reject(error);
    }
);

export default api;

export const cloudinaryRoot = import.meta.env.VITE_PATH_CLOUDINARY