import { create } from 'zustand';
import { axiosBank } from '../../../shared/apis/index.js';

export const useAccountStore = create((set) => ({

    cuentas: [],
    loading: false,
    error: null,

    fetchMisCuentas: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosBank.get('/NovaCoin/v1/cuenta/mis-cuentas');
            set({ cuentas: data.cuentas || [], loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error al cargar las cuentas',
                loading: false
            });
        }
    },

    clearError: () => set({ error: null })

}));