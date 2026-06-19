// src/shared/api/employeeClient.js

import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

const employeeClient = axios.create({
  baseURL: ENDPOINTS.EMPLOYEES,
  headers: {
    'Content-Type': 'application/json',
  },
});

employeeClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const employeeService = {
  getEmployees: async (params = {}) => {
    const response = await employeeClient.get('/', { params });
    return response.data;
  },
  
  getEmployeeById: async (employeeId) => {
    const response = await employeeClient.get(`/${employeeId}`);
    return response.data;
  },
  
  createEmployee: async (employeeData) => {
    const response = await employeeClient.post('/', employeeData);
    return response.data;
  },
  
  updateEmployee: async (employeeId, employeeData) => {
    const response = await employeeClient.put(`/${employeeId}`, employeeData);
    return response.data;
  },
  
  deleteEmployee: async (employeeId) => {
    const response = await employeeClient.delete(`/${employeeId}`);
    return response.data;
  },
  
  getEmployeeStats: async (employeeId) => {
    const response = await employeeClient.get(`/${employeeId}/stats`);
    return response.data;
  },
};

export default employeeClient;
