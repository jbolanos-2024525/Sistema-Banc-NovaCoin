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
            const { data } = await axiosBank.get('/NovaCoin/v1/cuenta/mis-cuentas');
            
            console.log("Data recibida de /mis-cuentas:", data);

            let listaCuentas = [];
            
            // Evaluamos la estructura del documento que viene de Mongo
            // Si viene el objeto directo de la cuenta (como se ve en Compass) sin la propiedad .cuentas
            if (data && typeof data === 'object' && !Array.isArray(data) && !data.cuentas) {
                listaCuentas = [data]; // Lo envolvemos en un array para que el .map() de React no rompa
            } 
            // Si tu backend lo devuelve envuelto en un objeto { cuentas: [...] } o { cuentas: {...} }
            else if (data && data.cuentas) {
                listaCuentas = Array.isArray(data.cuentas) ? data.cuentas : [data.cuentas];
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