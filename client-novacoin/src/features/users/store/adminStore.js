import { create } from 'zustand';
import { registerRequest } from '../../../shared/apis/authService';

export const useAdminStore = create((set) => ({
  loading: false,
  error: null,

  createUser: async (formData) => {
    try {
      set({ loading: true, error: null });
      const response = await registerRequest(formData);
      set({ loading: false });
      return {
        success: response.success,                                    // ← viene del backend
        emailVerificationRequired: response.emailVerificationRequired, // ← viene del backend
        data: response.user,
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear usuario';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));