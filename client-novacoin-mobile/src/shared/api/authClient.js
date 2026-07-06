// src/shared/api/authClient.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Crear instancia de axios para autenticación
const axiosAuth = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
axiosAuth.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Llamada para refrescar el token
        const response = await axios.post(`${ENDPOINTS.AUTH}/api/v1/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken, user } = response.data;
        
        // Actualizar el store con el nuevo token
        useAuthStore.getState().updateToken(accessToken);
        if (user) useAuthStore.getState().updateUser(user);
        
        // Guardar el nuevo refresh token en SecureStore
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        useAuthStore.getState().logout();
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Iniciar sesión
  login: async (emailOrUsername, password) => {
    const response = await axiosAuth.post('/api/v1/auth/login', { EmailOrUsername: emailOrUsername, Password: password });
    return response.data;
  },
  
  // Registrar usuario
  register: async (userData) => {
    const response = await axiosAuth.post('/api/v1/auth/register', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Cerrar sesión
  logout: async () => {
    try {
      await axiosAuth.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      useAuthStore.getState().logout();
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },
  
  // Refrescar token
  refreshToken: async (refreshToken) => {
    const response = await axiosAuth.post('/api/v1/auth/refresh', { refreshToken });
    return response.data;
  },
  
  // Obtener perfil de usuario
  getProfile: async () => {
    const response = await axiosAuth.get('/api/v1/auth/profile');
    return response.data;
  },
  
  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await axiosAuth.put('/api/v1/auth/profile', userData);
    return response.data;
  },
  
  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await axiosAuth.post('/api/v1/auth/change-password', passwordData);
    return response.data;
  },
  
  // Solicitar recuperación de contraseña
  forgotPassword: async (email) => {
    const response = await axiosAuth.post('/api/v1/auth/forgot-password', { email });
    return response.data;
  },
  
  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    const response = await axiosAuth.post('/api/v1/auth/reset-password', { token, newPassword });
    return response.data;
  },
  
  // Obtener todos los usuarios (admin)
  getAllUsers: async () => {
    const response = await axiosAuth.get('/api/v1/auth/users');
    return response.data;
  },
};

export default axiosAuth;
