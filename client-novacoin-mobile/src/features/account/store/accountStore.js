// src/features/account/store/accountStore.js

import { create } from 'zustand';
import { accountService } from '../../../shared/api/accountClient';

export const useAccountStore = create((set, get) => ({
  cuentas: [],
  loading: false,
  error: null,

  fetchMisCuentas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await accountService.getAccounts();
      set({ cuentas: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener cuentas:', error);
      set({ error: error.message, loading: false });
    }
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-GT', { 
      style: 'currency', 
      currency: 'GTQ' 
    }).format(amount ?? 0);
  },
}));
