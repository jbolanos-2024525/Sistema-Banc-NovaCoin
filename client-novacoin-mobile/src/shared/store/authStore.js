// src/shared/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticación
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      
      // Acciones de autenticación
      setAuth: (data) => {
        set({
          isAuthenticated: true,
          user: data.user || data.userDetails,
          token: data.token || data.accessToken,
          refreshToken: data.refreshToken,
        });
      },
      
      updateUser: (userData) => {
        set({ user: userData });
      },
      
      updateToken: (newToken) => {
        set({ token: newToken });
      },
      
      updateRefreshToken: (newRefreshToken) => {
        set({ refreshToken: newRefreshToken });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
        });
      },
      
      // Verificar si el token está expirado
      isTokenExpired: () => {
        const { token } = get();
        if (!token) return true;
        
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          return payload.exp < currentTime;
        } catch (error) {
          return true;
        }
      },
      
      // Obtener el tiempo de expiración del token
      getTokenExpiration: () => {
        const { token } = get();
        if (!token) return null;
        
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp * 1000; // Convertir a milisegundos
        } catch (error) {
          return null;
        }
      },
    }),
    {
      name: 'novacoin-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
