import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
    baseURL: 'https://novacoin-auth-service.onrender.com/api/v1',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
});

const axiosBank = axios.create({
    baseURL: 'https://novacoin-auth-node.onrender.com',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) =>
        error ? prom.reject(error) : prom.resolve(token)
    );
    failedQueue = [];
};

const createResponseInterceptor = (axiosInstance) => async (error) => {
    const originalRequest = error.config;

    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
    }

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        })
            .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
        const refreshToken = useAuthStore.getState().refreshToken;

        const response = await axiosAuth.post('/auth/refresh', {
            refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

    } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);

    } finally {
        isRefreshing = false;
    }

    return Promise.reject(error);
};

axiosAuth.interceptors.response.use(
    (response) => response,
    createResponseInterceptor(axiosAuth)   
);

axiosBank.interceptors.response.use(
    (response) => response,
    createResponseInterceptor(axiosBank)
);

export { axiosAuth, axiosBank };