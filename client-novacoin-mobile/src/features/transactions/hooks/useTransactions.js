// src/features/transactions/hooks/useTransactions.js

import { useState, useCallback } from 'react';
import { transactionService } from '../../../shared/api/transactionClient';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.getTransactions(params);
      const data = response.data.data || response.data;
      
      const mappedTransactions = data.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        status: transaction.status,
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
      }));
      
      setTransactions(mappedTransactions);
      return mappedTransactions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar transacciones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccountTransactions = useCallback(async (accountId, params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.getAccountTransactions(accountId, params);
      const data = response.data.data || response.data;
      
      const mappedTransactions = data.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        status: transaction.status,
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
      }));
      
      setTransactions(mappedTransactions);
      return mappedTransactions;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar transacciones de la cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransfer = useCallback(async (transferData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.createTransfer(transferData);
      const data = response.data.data || response.data;
      
      await fetchTransactions();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al realizar transferencia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const createDeposit = useCallback(async (depositData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.createDeposit(depositData);
      const data = response.data.data || response.data;
      
      await fetchTransactions();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al realizar depósito';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const createWithdrawal = useCallback(async (withdrawalData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.createWithdrawal(withdrawalData);
      const data = response.data.data || response.data;
      
      await fetchTransactions();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al realizar retiro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const cancelTransaction = useCallback(async (transactionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionService.cancelTransaction(transactionId);
      const data = response.data.data || response.data;
      
      await fetchTransactions();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cancelar transacción';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchAccountTransactions,
    createTransfer,
    createDeposit,
    createWithdrawal,
    cancelTransaction,
  };
};

export default useTransactions;
