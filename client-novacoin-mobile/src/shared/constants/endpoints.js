// src/shared/constants/endpoints.js

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:5000/api/auth',
  ACCOUNTS: process.env.EXPO_PUBLIC_ACCOUNTS_URL || 'http://localhost:5000/api/accounts',
  TRANSACTIONS: process.env.EXPO_PUBLIC_TRANSACTIONS_URL || 'http://localhost:5000/api/transactions',
  LOANS: process.env.EXPO_PUBLIC_LOANS_URL || 'http://localhost:5000/api/loans',
  EMPLOYEES: process.env.EXPO_PUBLIC_EMPLOYEES_URL || 'http://localhost:5000/api/employees',
};

export default ENDPOINTS;
