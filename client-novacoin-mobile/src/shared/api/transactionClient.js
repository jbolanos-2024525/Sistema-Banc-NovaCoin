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
        '/auth/refresh',
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
  // Obtener todas las transacciones (admin)
  getAllTransactions: async () => {
    const response = await axiosTransAdmin.get('/transaccion');
    return response.data;
  },
  
  // Obtener los detalles de una sola transacción por ID
  getTransactionById: async (id) => {
    const response = await axiosTrans.get(`/transaccion/${id}`);
    return response.data;
  },
  
  // Crear una nueva transacción (Transferencia, Depósito, Retiro)
  createTransaction: async (transactionData) => {
    const response = await axiosTransAdmin.post('/transaccion', transactionData);
    return response.data;
  },
  
  getTransactions: async (params = {}) => {
    const response = await axiosTrans.get('/', { params });
    return response.data;
  },
  
  getAccountTransactions: async (accountId, params = {}) => {
    const response = await axiosTrans.get(`/account/${accountId}`, { params });
    return response.data;
  },
  
  createTransfer: async (transferData) => {
    const response = await axiosTrans.post('/transfer', transferData);
    return response.data;
  },
  
  createDeposit: async (depositData) => {
    const response = await axiosTrans.post('/deposit', depositData);
    return response.data;
  },
  
  createWithdrawal: async (withdrawalData) => {
    const response = await axiosTrans.post('/withdrawal', withdrawalData);
    return response.data;
  },
  
  cancelTransaction: async (transactionId) => {
    const response = await axiosTrans.post(`/${transactionId}/cancel`);
    return response.data;
  },
};

export { axiosTrans, axiosTransAdmin };
export default axiosTrans;
