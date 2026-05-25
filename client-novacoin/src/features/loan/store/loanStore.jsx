import { create } from 'zustand';

const mockLoans = [
    {
        id: '1',
        monto: 25000,
        plazoMeses: 24,
        cuotaMensual: 1179.17,
        proposito: 'Compra de vehículo',
        estadoPrestamo: 'ACTIVO',
        tipoPrestamo: 'PERSONAL',
        tasaInteres: 12,
        fechaSolicitud: '2026-01-15T10:00:00Z',
    },
    {
        id: '2',
        monto: 10000,
        plazoMeses: 12,
        cuotaMensual: 888.49,
        proposito: 'Negocio propio',
        estadoPrestamo: 'PAGADO',
        tipoPrestamo: 'PERSONAL',
        tasaInteres: 12,
        fechaSolicitud: '2025-06-10T10:00:00Z',
    },
];

export const useLoanStore = create((set) => ({
    loans: [...mockLoans],
    loading: false,
    error: null,

    fetchLoans: async () => {
        set({ loading: true, error: null });
        await new Promise((r) => setTimeout(r, 500));
        set((state) => ({ 
            loans: state.loans.length > 0 ? state.loans : [...mockLoans], 
            loading: false 
        }));
    },

    requestLoan: async (loanData) => {
        try {
            set({ loading: true, error: null });
            await new Promise((r) => setTimeout(r, 500));
            const tasaMensual = 0.15 / 12;
            const cuotaMensual = parseFloat(
                ((loanData.monto * tasaMensual) /
                (1 - Math.pow(1 + tasaMensual, -loanData.plazoMeses))).toFixed(2)
            );
            const newLoan = {
                id: Date.now().toString(),
                monto: loanData.monto,
                plazoMeses: loanData.plazoMeses,
                proposito: loanData.proposito,
                tasaInteres: loanData.tasaInteres,
                cuotaMensual,
                estadoPrestamo: 'ACTIVO',
                tipoPrestamo: 'PERSONAL',
                fechaSolicitud: new Date().toISOString(),
            };
            set((state) => ({
                loans: [newLoan, ...state.loans],
                loading: false,
            }));
            return { success: true };
        } catch (err) {
            set({ error: 'Error al solicitar el préstamo', loading: false });
            return { success: false };
        }
    },

    clearError: () => set({ error: null }),
}));