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
      const response = await loanService.getAllLoans();
      const data = response.data.data || response.data;
      
      const mappedLoans = data.map((loan) => ({
        id: loan._id || loan.id,
        amount: loan.monto,
        interestRate: loan.tasaInteres,
        term: loan.plazoMeses,
        status: loan.estadoPrestamo,
        monthlyPayment: loan.cuotaMensual,
        startDate: loan.fechaAprobacion,
        endDate: loan.fechaVencimiento,
        remainingBalance: loan.montoPendiente,
        totalPaid: loan.totalPagado,
        paidInstallments: loan.numeroCuotasPagadas,
        tipoPrestamo: loan.tipoPrestamo,
        cliente: loan.cliente,
        empleado: loan.empleado,
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

  const fetchMyLoans = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoansByCliente(clienteId);
      const data = response.data.data || response.data;
      
      const mappedLoans = data.map((loan) => ({
        id: loan._id || loan.id,
        amount: loan.monto,
        interestRate: loan.tasaInteres,
        term: loan.plazoMeses,
        status: loan.estadoPrestamo,
        monthlyPayment: loan.cuotaMensual,
        startDate: loan.fechaAprobacion,
        endDate: loan.fechaVencimiento,
        remainingBalance: loan.montoPendiente,
        totalPaid: loan.totalPagado,
        paidInstallments: loan.numeroCuotasPagadas,
        tipoPrestamo: loan.tipoPrestamo,
        cliente: loan.cliente,
        empleado: loan.empleado,
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
        id: data._id || data.id,
        amount: data.monto,
        interestRate: data.tasaInteres,
        term: data.plazoMeses,
        status: data.estadoPrestamo,
        monthlyPayment: data.cuotaMensual,
        startDate: data.fechaAprobacion,
        endDate: data.fechaVencimiento,
        remainingBalance: data.montoPendiente,
        totalPaid: data.totalPagado,
        paidInstallments: data.numeroCuotasPagadas,
        tipoPrestamo: data.tipoPrestamo,
        cliente: data.cliente,
        empleado: data.empleado,
        proposito: data.proposito,
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
      const response = await loanService.createLoan(loanData);
      const data = response.data.data || response.data;
      
      await fetchLoans();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al solicitar préstamo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLoans]);

  const makePayment = useCallback(async (loanId, paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.makePayment(loanId, paymentData);
      const data = response.data.data || response.data;
      
      await fetchLoans();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al realizar pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLoans]);



  return {
    loans,
    loading,
    error,
    fetchLoans,
    fetchMyLoans,
    getLoanById,
    applyForLoan,
    makePayment,
  };
};

export default useLoans;
