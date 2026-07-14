// src/shared/api/accountClient.js

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
        '/auth/refresh',
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

const BASE_ADMIN = '/NovaCoin/Admin/v1/cuenta';
const BASE_USER = '/NovaCoin/v1/cuenta';

export const accountService = {
  // Admin endpoints
  getAccounts: async () => {
    const response = await axiosBank.get(BASE_ADMIN);
    return response.data;
  },
  
  getAccountById: async (accountId) => {
    const response = await axiosBank.get(`${BASE_ADMIN}/${accountId}`);
    return response.data;
  },
  
  createAccount: async (accountData) => {
    const response = await axiosBank.post(BASE_ADMIN, accountData);
    return response.data;
  },
  
  updateAccount: async (accountId, accountData) => {
    const response = await axiosBank.put(`${BASE_ADMIN}/${accountId}`, accountData);
    return response.data;
  },
  
  closeAccount: async (accountId) => {
    const response = await axiosBank.delete(`${BASE_ADMIN}/${accountId}`);
    return response.data;
  },
  
  // User endpoints
  getMyAccounts: async () => {
    const response = await axiosBank.get(`${BASE_USER}/mis-cuentas`);
    return response.data;
  },
  
  deposit: async (cuentaId, amount) => {
    const response = await axiosBank.patch(`${BASE_USER}/deposit/${cuentaId}`, { monto: amount });
    return response.data;
  },
  
  withdraw: async (cuentaId, amount) => {
    const response = await axiosBank.patch(`${BASE_USER}/withdraw/${cuentaId}`, { monto: amount });
    return response.data;
  },
  
  transfer: async (transferData) => {
    const response = await axiosBank.post(`${BASE_USER}/transfer`, transferData);
    return response.data;
  },
};

export default axiosBank;
