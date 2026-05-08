import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosBank = axios.create({
    baseURL: import.meta.env.VITE_BANK_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
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
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosBank.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;

                        return axiosBank(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken =
                    useAuthStore.getState().refreshToken;

                const response = await axiosAuth.post(
                    '/auth/refresh',
                    {
                        token: refreshToken,
                    }
                );

                const {
                    accessToken,
                    refreshToken: newRefreshToken,
                } = response.data;

                useAuthStore
                    .getState()
                    .setTokens(
                        accessToken,
                        newRefreshToken
                    );

                processQueue(null, accessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return axiosBank(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                useAuthStore.getState().logout();

                window.location.href = '/login';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { axiosAuth, axiosBank };
