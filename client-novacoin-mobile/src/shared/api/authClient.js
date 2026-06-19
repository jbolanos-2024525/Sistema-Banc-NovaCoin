// src/shared/api/authClient.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints';
import { useAuthStore } from '../store/authStore';

// Crear instancia de axios para autenticación
const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
authClient.interceptors.request.use(
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
authClient.interceptors.response.use(
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
        const response = await axios.post(`${ENDPOINTS.AUTH}/refresh`, {
          refreshToken,
        });
        
        const { token, refreshToken: newRefreshToken, user } = response.data;
        
        // Actualizar el store con el nuevo token
        useAuthStore.getState().updateToken(token);
        useAuthStore.getState().updateUser(user);
        
        // Guardar el nuevo refresh token en SecureStore
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return authClient(originalRequest);
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
  login: async (email, password) => {
    const response = await authClient.post('/login', { email, password });
    return response.data;
  },
  
  // Registrar usuario
  register: async (userData) => {
    const response = await authClient.post('/register', userData);
    return response.data;
  },
  
  // Cerrar sesión
  logout: async () => {
    try {
      await authClient.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      useAuthStore.getState().logout();
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },
  
  // Refrescar token
  refreshToken: async (refreshToken) => {
    const response = await authClient.post('/refresh', { refreshToken });
    return response.data;
  },
  
  // Obtener perfil de usuario
  getProfile: async () => {
    const response = await authClient.get('/profile');
    return response.data;
  },
  
  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await authClient.put('/profile', userData);
    return response.data;
  },
  
  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await authClient.post('/change-password', passwordData);
    return response.data;
  },
  
  // Solicitar recuperación de contraseña
  forgotPassword: async (email) => {
    const response = await authClient.post('/forgot-password', { email });
    return response.data;
  },
  
  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    const response = await authClient.post('/reset-password', { token, newPassword });
    return response.data;
  },
};

export default authClient;
