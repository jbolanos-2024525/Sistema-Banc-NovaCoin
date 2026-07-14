import { create } from 'zustand';
import { 
    getAllTransactionsRequest, 
    createTransactionRequest,
    updateTransactionRequest,
    deleteTransactionRequest,
    cancelTransactionRequest
} from '../../../shared/apis/transactionsService';

export const useTransactionsStore = create((set, get) => ({
    transactions: [],
    loading: false,
    error: null,

    // Acción para cargar el historial en el Dashboard
    fetchTransactions: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getAllTransactionsRequest();
            // Node.js service returns { success: true, data: transacciones, count: n }
            set({ transactions: response.data || response, loading: false });
        } catch (err) {
            const message = err.response?.data?.message || 'Error al cargar las transacciones';
            set({ error: message, loading: false });
        }
    },

    // Acción para ejecutar una nueva transferencia desde el formulario de React
    executeTransaction: async (transactionData) => {
        try {
            set({ loading: true, error: null });
            const response = await createTransactionRequest(transactionData);

            // Si la transacción fue exitosa, la agregamos de inmediato a la lista del estado
            if (response.success) {
                set((state) => ({
                    transactions: [response.data, ...state.transactions],
                    loading: false
                }));
            }
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al procesar la transacción';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    updateTransaction: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateTransactionRequest(id, data);
            set((state) => ({
                transactions: state.transactions.map(t => (t._id || t.id) === id ? response.data : t),
                loading: false
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al actualizar la transacción';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    deleteTransaction: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteTransactionRequest(id);
            set((state) => ({
                transactions: state.transactions.filter(t => (t._id || t.id) !== id),
                loading: false
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al eliminar la transacción';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    cancelTransaction: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await cancelTransactionRequest(id);
            set((state) => ({
                transactions: state.transactions.map(t => (t._id || t.id) === id ? response.data || { ...t, EstadoTransaccion: 'CANCELADA' } : t),
                loading: false
            }));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Error al cancelar la transacción';
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    clearError: () => set({ error: null })
}));