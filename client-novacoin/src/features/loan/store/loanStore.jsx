import { create } from 'zustand';
import {
    getAllLoansRequest,
    createLoanRequest,
    updateLoanRequest,
    cancelLoanRequest,
    deleteLoanRequest,
} from '../../../shared/apis/loanService';

export const useLoanStore = create((set) => ({
    loans: [],
    loading: false,
    error: null,

    fetchLoans: async () => {
        try {
            set({ loading: true, error: null });
            const data = await getAllLoansRequest();
            set({ loans: Array.isArray(data) ? data : data.data ?? [], loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Error al cargar préstamos', loading: false });
        }
    },

    requestLoan: async (loanData) => {
        try {
            set({ loading: true, error: null });
            const data = await createLoanRequest(loanData);
            const newLoan = data.data ?? data;
            set((state) => ({ loans: [newLoan, ...state.loans], loading: false }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al solicitar el préstamo';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    updateLoan: async (id, loanData) => {
        try {
            set({ loading: true, error: null });
            const data = await updateLoanRequest(id, loanData);
            const updated = data.data ?? data;
            set((state) => ({
                loans: state.loans.map((l) => (l._id || l.id) === id ? updated : l),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al actualizar el préstamo';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    cancelLoan: async (id) => {
        try {
            set({ loading: true, error: null });
            await cancelLoanRequest(id);
            set((state) => ({
                loans: state.loans.map((l) =>
                    (l._id || l.id) === id
                        ? { ...l, estadoPrestamo: 'CANCELADO', estado: 'CANCELADO' }
                        : l
                ),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al cancelar el préstamo';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    deleteLoan: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteLoanRequest(id);
            set((state) => ({
                loans: state.loans.filter((l) => (l._id || l.id) !== id),
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar el préstamo';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    clearError: () => set({ error: null }),
}));