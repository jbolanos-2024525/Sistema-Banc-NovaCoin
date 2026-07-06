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
    const response = await axiosBank.patch(`${BASE}/${id}/cancelar`);
    return response.data;
  },
  
  deleteLoan: async (id) => {
    const response = await axiosBank.delete(`${BASE}/${id}`);
    return response.data;
  },
  
  getLoans: async (params = {}) => {
    const response = await axiosBank.get('/', { params });
    return response.data;
  },
  
  applyForLoan: async (loanData) => {
    const response = await axiosBank.post('/apply', loanData);
    return response.data;
  },
  
  getLoanPayments: async (loanId) => {
    const response = await axiosBank.get(`/${loanId}/payments`);
    return response.data;
  },
  
  makePayment: async (loanId, paymentData) => {
    const response = await axiosBank.post(`/${loanId}/payment`, paymentData);
    return response.data;
  },
  
  getLoanSchedule: async (loanId) => {
    const response = await axiosBank.get(`/${loanId}/schedule`);
    return response.data;
  },
  
  calculateLoanQuote: async (loanData) => {
    const response = await axiosBank.post('/calculate', loanData);
    return response.data;
  },
};

export default axiosBank;
