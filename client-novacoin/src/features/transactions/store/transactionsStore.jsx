import { create } from 'zustand';
import { 
    getAllTransactionsRequest, 
    createTransactionRequest 
} from '../../../shared/apis/transactionsService';

export const useTransactionsStore = create((set, get) => ({
    transactions: [],
    loading: false,
    error: null,

    // Acción para cargar el historial en el Dashboard
    fetchTransactions: async () => {
        try {
            set({ loading: true, error: null });
            const data = await getAllTransactionsRequest();
            set({ transactions: data, loading: false });
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
            
        console.log('Respuesta del backend:', response);

            // Si la transacción fue exitosa, la agregamos de inmediato a la lista del estado
            if (response.success) {
                set((state) => ({
                    transactions: [response.transaccion, ...state.transactions],
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

    clearError: () => set({ error: null })
}));