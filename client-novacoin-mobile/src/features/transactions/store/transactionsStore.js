// src/features/transactions/store/transactionsStore.js

import { create } from 'zustand';
import { transactionService } from '../../../shared/api/transactionClient';

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await transactionService.getAllTransactions();
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
      await get().fetchTransactions();
      return { success: true };
    } catch (error) {
      console.error('Error al ejecutar transacción:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));
