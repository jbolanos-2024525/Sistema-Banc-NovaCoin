// src/shared/api/accountClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const accountClient = axios.create({
  baseURL: ENDPOINTS.ACCOUNTS,
  headers: {
    'Content-Type': 'application/json',
  },
});

accountClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const accountService = {
  getAccounts: async () => {
    const response = await accountClient.get('/');
    return response.data;
  },
  
  getAccountById: async (accountId) => {
    const response = await accountClient.get(`/${accountId}`);
    return response.data;
  },
  
  createAccount: async (accountData) => {
    const response = await accountClient.post('/', accountData);
    return response.data;
  },
  
  updateAccount: async (accountId, accountData) => {
    const response = await accountClient.put(`/${accountId}`, accountData);
    return response.data;
  },
  
  closeAccount: async (accountId) => {
    const response = await accountClient.delete(`/${accountId}`);
    return response.data;
  },
  
  getAccountBalance: async (accountId) => {
    const response = await accountClient.get(`/${accountId}/balance`);
    return response.data;
  },
};

export default accountClient;
