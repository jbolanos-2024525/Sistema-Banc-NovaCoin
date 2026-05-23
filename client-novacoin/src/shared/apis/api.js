import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

// 1. Instancia para Autenticación (Usuarios, Roles, Tokens)
const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Instancia para el core del Banco (Cuentas, Clientes, etc.)
const axiosBank = axios.create({
    baseURL: import.meta.env.VITE_BANK_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. NUEVA INSTANCIA: Específica para el Microservicio de Transacciones
// Apuntará a la URL de tu backend de transacciones (ej: http://localhost:5150/api)
const axiosTrans = axios.create({
    baseURL: import.meta.env.VITE_TRANS_URL || 'http://localhost:5150/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de solicitudes: Adjunta automáticamente el Token JWT a las 3 instancias
const requestInterceptor = (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

axiosAuth.interceptors.request.use(requestInterceptor);
axiosBank.interceptors.request.use(requestInterceptor);
axiosTrans.interceptors.request.use(requestInterceptor); // <-- Protege transacciones

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

// Función reutilizable para manejar el refresco de token en interceptores de respuesta
const handleResponseError = (axiosInstance) => async (error) => {
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
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = useAuthStore.getState().refreshToken;

            const response = await axiosAuth.post(
                '/auth/refresh',
                { token: refreshToken }
            );

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
    }

    return Promise.reject(error);
};

// Aplicamos el interceptor de respuestas y refresco a Bank y a Transacciones
axiosBank.interceptors.response.use((res) => res, handleResponseError(axiosBank));
axiosTrans.interceptors.response.use((res) => res, handleResponseError(axiosTrans));

export { axiosAuth, axiosBank, axiosTrans };