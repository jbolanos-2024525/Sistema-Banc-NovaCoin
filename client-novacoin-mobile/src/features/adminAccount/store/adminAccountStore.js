// src/features/adminAccount/store/adminAccountStore.js

import { create } from 'zustand';
import { accountService } from '../../../shared/api/accountClient';

export const useAdminAccountStore = create((set, get) => ({
  cuentas: [],
  loading: false,
  error: null,

  fetchCuentas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await accountService.getAccounts();
      set({ cuentas: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener cuentas:', error);
      set({ error: error.message, loading: false });
    }
  },

  createCuenta: async (dto) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating account with DTO:', dto);
      const response = await accountService.createAccount(dto);
      console.log('Account creation response:', response);
      
      // Si la cuenta fue creada exitosamente, la agregamos de inmediato a la lista del estado
      if (response.success || response.data) {
        const newAccount = response.data || response;
        set((state) => ({
          cuentas: [newAccount, ...state.cuentas],
          loading: false
        }));
      } else {
        await get().fetchCuentas();
      }
      return { success: true };
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      set({ error: error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateCuenta: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      console.log('Actualizando cuenta con ID:', id);
      console.log('Datos a actualizar:', dto);
      const response = await accountService.updateAccount(id, dto);
      console.log('Respuesta del servidor:', response);
      set((state) => ({
        cuentas: state.cuentas.map(c => (c._id || c.id) === id ? (response.data || response) : c),
        loading: false
      }));
      console.log('Cuentas actualizadas en estado');
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      console.error('Error response:', error.response?.data);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteCuenta: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await accountService.closeAccount(id);
      set((state) => ({
        cuentas: state.cuentas.filter(c => (c._id || c.id) !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-GT', { 
      style: 'currency', 
      currency: 'GTQ' 
    }).format(amount ?? 0);
  },
}));
