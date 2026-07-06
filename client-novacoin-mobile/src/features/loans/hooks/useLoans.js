// src/features/loans/hooks/useLoans.js

import { useState, useCallback } from 'react';
import { loanService } from '../../../shared/api/loanClient';

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLoans = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoans(params);
      const data = response.data.data || response.data;
      
      const mappedLoans = data.map((loan) => ({
        id: loan.id,
        amount: loan.amount,
        interestRate: loan.interestRate,
        term: loan.term,
        status: loan.status,
        monthlyPayment: loan.monthlyPayment,
        startDate: loan.startDate,
        endDate: loan.endDate,
        remainingBalance: loan.remainingBalance,
      }));
      
      setLoans(mappedLoans);
      return mappedLoans;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar préstamos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyLoans = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoans({ ...params, myLoans: true });
      const data = response.data.data || response.data;
      
      const mappedLoans = data.map((loan) => ({
        id: loan.id,
        amount: loan.amount,
        interestRate: loan.interestRate,
        term: loan.term,
        status: loan.status,
        monthlyPayment: loan.monthlyPayment,
        startDate: loan.startDate,
        endDate: loan.endDate,
        remainingBalance: loan.remainingBalance,
      }));
      
      setLoans(mappedLoans);
      return mappedLoans;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar mis préstamos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLoanById = useCallback(async (loanId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoanById(loanId);
      const data = response.data.data || response.data;
      
      const mappedLoan = {
        id: data.id,
        amount: data.amount,
        interestRate: data.interestRate,
        term: data.term,
        status: data.status,
        monthlyPayment: data.monthlyPayment,
        startDate: data.startDate,
        endDate: data.endDate,
        remainingBalance: data.remainingBalance,
        payments: data.payments || [],
      };
      
      return mappedLoan;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar préstamo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyForLoan = useCallback(async (loanData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.applyForLoan(loanData);
      const data = response.data.data || response.data;
      
      await fetchMyLoans();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al solicitar préstamo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyLoans]);

  const makePayment = useCallback(async (loanId, paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.makePayment(loanId, paymentData);
      const data = response.data.data || response.data;
      
      await fetchMyLoans();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al realizar pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyLoans]);

  const getLoanSchedule = useCallback(async (loanId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoanSchedule(loanId);
      const data = response.data.data || response.data;
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar cronograma de pagos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateLoanQuote = useCallback(async (loanData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.calculateLoanQuote(loanData);
      const data = response.data.data || response.data;
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al calcular cotización';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loans,
    loading,
    error,
    fetchLoans,
    fetchMyLoans,
    getLoanById,
    applyForLoan,
    makePayment,
    getLoanSchedule,
    calculateLoanQuote,
  };
};

export default useLoans;
