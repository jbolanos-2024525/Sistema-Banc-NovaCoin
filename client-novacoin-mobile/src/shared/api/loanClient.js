// src/shared/api/loanClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const loanClient = axios.create({
  baseURL: ENDPOINTS.LOANS,
  headers: {
    'Content-Type': 'application/json',
  },
});

loanClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loanService = {
  getLoans: async (params = {}) => {
    const response = await loanClient.get('/', { params });
    return response.data;
  },
  
  getLoanById: async (loanId) => {
    const response = await loanClient.get(`/${loanId}`);
    return response.data;
  },
  
  applyForLoan: async (loanData) => {
    const response = await loanClient.post('/apply', loanData);
    return response.data;
  },
  
  getLoanPayments: async (loanId) => {
    const response = await loanClient.get(`/${loanId}/payments`);
    return response.data;
  },
  
  makePayment: async (loanId, paymentData) => {
    const response = await loanClient.post(`/${loanId}/payment`, paymentData);
    return response.data;
  },
  
  getLoanSchedule: async (loanId) => {
    const response = await loanClient.get(`/${loanId}/schedule`);
    return response.data;
  },
  
  calculateLoanQuote: async (loanData) => {
    const response = await loanClient.post('/calculate', loanData);
    return response.data;
  },
};

export default loanClient;
