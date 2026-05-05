import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const axiosBank = axios.create({
    baseURL: import.meta.env.VITE_BANK_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const requestInterceptor = (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

axiosAuth.interceptors.request.use(requestInterceptor);
axiosBank.interceptors.request.use(requestInterceptor);

axiosBank.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;
                const response = await axios.post(`${import.meta.env.VITE_AUTH_URL}/refresh`, {
                    token: refreshToken
                });

                const { accessToken } = response.data;
                useAuthStore.getState().setAccessToken(accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosBank(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { axiosAuth, axiosBank };