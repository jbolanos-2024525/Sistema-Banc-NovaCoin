// src/shared/api/transactionClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Instancia para transacciones de usuario
const axiosTrans = axios.create({
  baseURL: ENDPOINTS.TRANS_USER,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para transacciones de admin
const axiosTransAdmin = axios.create({
  baseURL: ENDPOINTS.TRANS_ADMIN,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instancia para refresh token
const axiosAuth = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestInterceptor = (config) => {
  const state = useAuthStore.getState();
  const token = state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosTrans.interceptors.request.use(requestInterceptor);
axiosTransAdmin.interceptors.request.use(requestInterceptor);
axiosAuth.interceptors.request.use(requestInterceptor);

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

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosAuth.post(
        '/api/v1/auth/refresh',
        { refreshToken: currentRefreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      useAuthStore.getState().updateToken(accessToken);
      useAuthStore.getState().updateRefreshToken(newRefreshToken);

      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

axiosTrans.interceptors.response.use((res) => res, handleResponseError(axiosTrans));
axiosTransAdmin.interceptors.response.use((res) => res, handleResponseError(axiosTransAdmin));

export const transactionService = {
  // Admin endpoints
  getAllTransactions: async () => {
    const response = await axiosTransAdmin.get('/transaccion');
    return response.data;
  },
  
  createTransaction: async (transactionData) => {
    const response = await axiosTransAdmin.post('/transaccion', transactionData);
    return response.data;
  },
  
  getTransactionByIdAdmin: async (id) => {
    const response = await axiosTransAdmin.get(`/transaccion/${id}`);
    return response.data;
  },
  
  getTransactionsByUsuario: async (usuarioId) => {
    const response = await axiosTransAdmin.get(`/transaccion/usuario/${usuarioId}`);
    return response.data;
  },
  
  getTransactionsByTipo: async (tipo) => {
    const response = await axiosTransAdmin.get(`/transaccion/tipo/${tipo}`);
    return response.data;
  },
  
  getTransactionsByEstado: async (estado) => {
    const response = await axiosTransAdmin.get(`/transaccion/estado/${estado}`);
    return response.data;
  },
  
  getTransactionsByFecha: async (params) => {
    const response = await axiosTransAdmin.get('/transaccion/fecha', { params });
    return response.data;
  },
  
  getTransactionsByPrestamo: async (prestamoId) => {
    const response = await axiosTransAdmin.get(`/transaccion/prestamo/${prestamoId}`);
    return response.data;
  },
  
  updateTransaction: async (id, transactionData) => {
    const response = await axiosTransAdmin.put(`/transaccion/${id}`, transactionData);
    return response.data;
  },
  
  deleteTransaction: async (id) => {
    const response = await axiosTransAdmin.delete(`/transaccion/${id}`);
    return response.data;
  },
  
  changeTransactionStatus: async (id, estado) => {
    const response = await axiosTransAdmin.patch(`/transaccion/estado/${id}`, { estado });
    return response.data;
  },
  
  // User endpoints
  getMyTransactions: async () => {
    const response = await axiosTrans.get('/transaccion/mis-transacciones');
    return response.data;
  },
  
  getTransactionById: async (id) => {
    const response = await axiosTrans.get(`/transaccion/${id}`);
    return response.data;
  },
  
  getTransactionsByCuenta: async (cuentaId) => {
    const response = await axiosTrans.get(`/transaccion/cuenta/${cuentaId}`);
    return response.data;
  },
  
  getResumen: async () => {
    const response = await axiosTrans.get('/transaccion/resumen');
    return response.data;
  },
};

export { axiosTrans, axiosTransAdmin };
export default axiosTrans;
