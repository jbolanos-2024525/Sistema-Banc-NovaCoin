// src/features/loan/store/loanStore.js

import { create } from 'zustand';
import { loanService } from '../../../shared/api/loanClient';

export const useLoanStore = create((set, get) => ({
  loans: [],
  loading: false,
  error: null,

  fetchLoans: async () => {
    set({ loading: true, error: null });
    try {
      const response = await loanService.getAllLoans();
      set({ loans: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      set({ error: error.message, loading: false });
    }
  },

  requestLoan: async (dto) => {
    set({ loading: true, error: null });
    try {
      const response = await loanService.createLoan(dto);
      await get().fetchLoans();
      return { success: true };
    } catch (error) {
      console.error('Error al solicitar préstamo:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateLoan: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const response = await loanService.updateLoan(id, dto);
      await get().fetchLoans();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar préstamo:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  cancelLoan: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await loanService.cancelLoan(id);
      await get().fetchLoans();
      return { success: true };
    } catch (error) {
      console.error('Error al cancelar préstamo:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteLoan: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await loanService.deleteLoan(id);
      await get().fetchLoans();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar préstamo:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));
