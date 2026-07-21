import { create } from 'zustand';
import { axiosBank } from '../../../shared/apis/index.js';

export const useAccountStore = create((set) => ({

    cuentas: [],
    loading: false,
    error: null,

    fetchMisCuentas: async () => {
        set({ loading: true, error: null });
        try {
            // Hacemos la petición al endpoint usando tu instancia en el puerto 3020
            const response = await axiosBank.get('/cuenta/mis-cuentas');
            
            console.log("Response recibida de /mis-cuentas:", response.data);

            let listaCuentas = [];
            
            // El backend devuelve { success: true, data: cuentas, count: n }
            if (response.data && response.data.data) {
                listaCuentas = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            }

            set({ cuentas: listaCuentas, loading: false });
        } catch (error) {
            console.error("Error en fetchMisCuentas:", error);
            set({
                error: error.response?.data?.message || 'Error al cargar las cuentas',
                loading: false
            });
        }
    },

    clearError: () => set({ error: null })

}));