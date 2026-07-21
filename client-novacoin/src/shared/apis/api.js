import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

// 1. Instancia para Autenticación (Usuarios, Roles, Tokens)
const axiosAuth = axios.create({
    baseURL: 'https://novacoin-auth-service.onrender.com/api/v1',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Instancia para el core del Banco (Cuentas, Clientes, etc.)
const axiosBank = axios.create({
    baseURL: 'https://novacoin-auth-node.onrender.com',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Instancia para el Microservicio de Transacciones (Usuario)
const axiosTrans = axios.create({
    baseURL: 'https://novacoin-auth-node.onrender.com',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 4. Instancia para el Microservicio de Transacciones (Admin - para crear transacciones)
const axiosTransAdmin = axios.create({
    baseURL: 'https://novacoin-auth-node.onrender.com',
    timeout: 120000,
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
axiosTrans.interceptors.request.use(requestInterceptor);
axiosTransAdmin.interceptors.request.use(requestInterceptor);

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
            const currentRefreshToken = useAuthStore.getState().refreshToken;

            // 🌟 CORRECCIÓN CRÍTICA: Cambiado de { token } a { refreshToken } para hacer match con tu DTO de .NET
            const response = await axiosAuth.post(
                '/auth/refresh',
                { refreshToken: currentRefreshToken }
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
axiosTransAdmin.interceptors.response.use((res) => res, handleResponseError(axiosTransAdmin));

export { axiosAuth, axiosBank, axiosTrans, axiosTransAdmin };