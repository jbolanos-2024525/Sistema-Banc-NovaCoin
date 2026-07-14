// src/shared/api/loanClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const axiosBank = axios.create({
  baseURL: ENDPOINTS.BANK,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosAuth = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosBank.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

const handleResponseError = async (error) => {
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
          return axiosBank(originalRequest);
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

      return axiosBank(originalRequest);
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

axiosBank.interceptors.response.use((res) => res, handleResponseError);

const BASE = '/NovaCoin/Admin/v1/prestamo';

export const loanService = {
  getAllLoans: async () => {
    const response = await axiosBank.get(BASE);
    return response.data;
  },
  
  getLoanById: async (id) => {
    const response = await axiosBank.get(`${BASE}/${id}`);
    return response.data;
  },
  
  createLoan: async (loanData) => {
    const response = await axiosBank.post(BASE, loanData);
    return response.data;
  },
  
  updateLoan: async (id, loanData) => {
    const response = await axiosBank.put(`${BASE}/${id}`, loanData);
    return response.data;
  },
  
  cancelLoan: async (id) => {
    const response = await axiosBank.patch(`${BASE}/cancelar/${id}`);
    return response.data;
  },
  
  deleteLoan: async (id) => {
    const response = await axiosBank.delete(`${BASE}/${id}`);
    return response.data;
  },
  
  getLoansByCliente: async (clienteId) => {
    const response = await axiosBank.get(`${BASE}/cliente/${clienteId}`);
    return response.data;
  },
  
  getLoansByEstado: async (estado) => {
    const response = await axiosBank.get(`${BASE}/estado/${estado}`);
    return response.data;
  },
  
  getLoansByEmpleado: async (empleadoId) => {
    const response = await axiosBank.get(`${BASE}/empleado/${empleadoId}`);
    return response.data;
  },
  
  makePayment: async (id, paymentData) => {
    const response = await axiosBank.patch(`${BASE}/pagar/${id}`, paymentData);
    return response.data;
  },
  
  changeLoanStatus: async (id, estado) => {
    const response = await axiosBank.patch(`${BASE}/estado/${id}`, { estado });
    return response.data;
  },
};

export default axiosBank;
