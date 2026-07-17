// src/features/transactions/store/transactionsStore.js

import { create } from 'zustand';
import { transactionService } from '../../../shared/api/transactionClient';
import { useAuthStore } from '../../../shared/store/authStore';

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const isAdmin = user?.role === 'ADMIN_ROLE';
      
      console.log('Fetching transactions, isAdmin:', isAdmin);
      
      const response = isAdmin 
        ? await transactionService.getAllTransactions()
        : await transactionService.getMyTransactions();
      
      console.log('Transactions response:', response);
      console.log('Transactions data:', response.data);
      
      set({ transactions: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      set({ error: error.message, loading: false });
    }
  },

  executeTransaction: async (transactionDto) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionService.createTransaction(transactionDto);
      
      // Si la transacción fue exitosa, la agregamos de inmediato a la lista del estado
      if (response.success || response.data) {
        const newTransaction = response.data || response;
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          loading: false
        }));
      } else {
        await get().fetchTransactions();
      }
      return { success: true };
    } catch (error) {
      console.error('Error al ejecutar transacción:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  cancelTransaction: async (transactionId) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionService.cancelTransaction(transactionId);
      set((state) => ({
        transactions: state.transactions.map(t => (t._id || t.id) === transactionId ? (response.data || { ...t, EstadoTransaccion: 'CANCELADA', estadoTransaccion: 'CANCELADA' }) : t),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error al cancelar transacción:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteTransaction: async (transactionId) => {
    set({ loading: true, error: null });
    try {
      await transactionService.deleteTransaction(transactionId);
      set((state) => ({
        transactions: state.transactions.filter(t => (t._id || t.id) !== transactionId),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateTransaction: async (transactionId, transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionService.updateTransaction(transactionId, transactionData);
      set((state) => ({
        transactions: state.transactions.map(t => (t._id || t.id) === transactionId ? (response.data || response) : t),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));
