// src/features/accounts/hooks/useAccounts.js

import { useState, useCallback } from 'react';
import { accountService } from '../../../shared/api/accountClient';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await accountService.getAccounts();
      const data = response.data.data || response.data;
      
      const mappedAccounts = data.map((account) => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        status: account.status,
      }));
      
      setAccounts(mappedAccounts);
      return mappedAccounts;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar cuentas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAccountById = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await accountService.getAccountById(accountId);
      const data = response.data.data || response.data;
      
      const mappedAccount = {
        id: data.id,
        accountNumber: data.accountNumber,
        accountType: data.accountType,
        balance: data.balance,
        status: data.status,
      };
      
      return mappedAccount;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (accountData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await accountService.createAccount(accountData);
      const data = response.data.data || response.data;
      
      await fetchAccounts();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts]);

  const closeAccount = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await accountService.closeAccount(accountId);
      const data = response.data.data || response.data;
      
      await fetchAccounts();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cerrar cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    getAccountById,
    createAccount,
    closeAccount,
  };
};

export default useAccounts;
