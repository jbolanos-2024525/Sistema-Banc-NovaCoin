// src/features/auth/hooks/useAuth.js

import { useState } from 'react';
import { authService } from '../../../shared/api/authClient';
import { useAuthStore } from '../../../shared/store/authStore';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async (emailOrUsername, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(emailOrUsername, password);
      
      const { accessToken, refreshToken, user } = response;
      
      setAuth({
        token: accessToken,
        refreshToken: refreshToken,
        user: user,
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      const { accessToken, refreshToken, user } = response;
      
      setAuth({
        token: accessToken,
        refreshToken: refreshToken,
        user: user,
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    logout,
  };
};

export default useAuth;
