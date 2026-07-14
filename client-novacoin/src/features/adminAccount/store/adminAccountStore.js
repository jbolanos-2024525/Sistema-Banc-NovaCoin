import { create } from 'zustand';
import { axiosBank } from '../../../shared/apis/index.js';

const BASE = '/NovaCoin/Admin/v1/cuenta';

export const useAdminAccountStore = create((set) => ({

    cuentas:  [],
    selected: null,
    loading:  false,
    error:    null,

    fetchCuentas: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosBank.get(BASE);
            set({ cuentas: data.data || data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al cargar las cuentas', loading: false });
        }
    },

    fetchCuentasByUsuario: async (usuarioId) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosBank.get(`${BASE}/usuario/${usuarioId}`);
            set({ cuentas: data.data || data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error al cargar las cuentas', loading: false });
        }
    },

    createCuenta: async (formData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosBank.post(BASE, formData);
            set((state) => ({ cuentas: [data.data || data, ...state.cuentas], loading: false }));
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al crear la cuenta';
            set({ error: msg, loading: false });
            return { success: false, error: msg };
        }
    },

    updateCuenta: async (id, formData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosBank.put(`${BASE}/${id}`, formData);
            set((state) => ({
                cuentas: state.cuentas.map((c) => c._id === id ? (data.data || data) : c),
                selected: null,
                loading: false
            }));
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar la cuenta';
            set({ error: msg, loading: false });
            return { success: false, error: msg };
        }
    },

    deleteCuenta: async (id) => {
        set({ loading: true, error: null });
        try {
            await axiosBank.delete(`${BASE}/${id}`);
            set((state) => ({ cuentas: state.cuentas.filter((c) => c._id !== id), loading: false }));
            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al eliminar la cuenta';
            set({ error: msg, loading: false });
            return { success: false, error: msg };
        }
    },

    setSelected:  (cuenta) => set({ selected: cuenta }),
    clearError:   ()       => set({ error: null }),

}));