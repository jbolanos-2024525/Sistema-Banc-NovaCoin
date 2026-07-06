// src/features/users/store/useUserManagementStore.js

import { create } from 'zustand';
import { authService } from '../../../shared/api/authClient';

export const useUserManagementStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await authService.getAllUsers();
      set({ users: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      set({ error: error.message, loading: false });
    }
  },

  createUser: async (dto) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(dto);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateUser: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.updateProfile(dto);
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      // Nota: authService no tiene un método delete específico, se puede implementar si es necesario
      await get().fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));

