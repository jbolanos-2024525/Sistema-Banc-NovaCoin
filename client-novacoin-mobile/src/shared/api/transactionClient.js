// src/shared/api/transactionClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const transactionClient = axios.create({
  baseURL: ENDPOINTS.TRANSACTIONS,
  headers: {
    'Content-Type': 'application/json',
  },
});

transactionClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await transactionClient.get('/', { params });
    return response.data;
  },
  
  getTransactionById: async (transactionId) => {
    const response = await transactionClient.get(`/${transactionId}`);
    return response.data;
  },
  
  getAccountTransactions: async (accountId, params = {}) => {
    const response = await transactionClient.get(`/account/${accountId}`, { params });
    return response.data;
  },
  
  createTransfer: async (transferData) => {
    const response = await transactionClient.post('/transfer', transferData);
    return response.data;
  },
  
  createDeposit: async (depositData) => {
    const response = await transactionClient.post('/deposit', depositData);
    return response.data;
  },
  
  createWithdrawal: async (withdrawalData) => {
    const response = await transactionClient.post('/withdrawal', withdrawalData);
    return response.data;
  },
  
  cancelTransaction: async (transactionId) => {
    const response = await transactionClient.post(`/${transactionId}/cancel`);
    return response.data;
  },
};

export default transactionClient;
