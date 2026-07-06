// src/shared/constants/endpoints.js

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://10.0.2.2:5262',
  BANK: process.env.EXPO_PUBLIC_BANK_URL || 'http://10.0.2.2:3020',
  TRANS_USER: process.env.EXPO_PUBLIC_TRANS_USER_URL || 'http://10.0.2.2:3020/NovaCoin/v1',
  TRANS_ADMIN: process.env.EXPO_PUBLIC_TRANS_ADMIN_URL || 'http://10.0.2.2:3020/NovaCoin/Admin/v1',
};

export default ENDPOINTS;
