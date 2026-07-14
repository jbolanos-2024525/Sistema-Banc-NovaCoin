import { axiosTrans, axiosTransAdmin } from './api.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

// Obtener todas las transacciones del usuario autenticado
export const getAllTransactionsRequest = async () => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    if (isAdmin) {
        const response = await axiosTransAdmin.get('/transaccion');
        return response.data;
    } else {
        const response = await axiosTrans.get('/transaccion/mis-transacciones');
        return response.data;
    }
};

// Obtener los detalles de una sola transacción por ID
export const getTransactionByIdRequest = async (id) => {
    const response = await axiosTrans.get(`/transaccion/${id}`);
    return response.data;
};

// Crear una nueva transacción (Transferencia, Depósito, Retiro)
export const createTransactionRequest = async (transactionData) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    if (isAdmin) {
        const response = await axiosTransAdmin.post('/transaccion', transactionData);
        return response.data;
    } else {
        const response = await axiosTrans.post('/transaccion', transactionData);
        return response.data;
    }
};

// Actualizar una transacción existente
export const updateTransactionRequest = async (id, transactionData) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    if (isAdmin) {
        const response = await axiosTransAdmin.put(`/transaccion/${id}`, transactionData);
        return response.data;
    } else {
        const response = await axiosTrans.put(`/transaccion/${id}`, transactionData);
        return response.data;
    }
};

// Eliminar una transacción
export const deleteTransactionRequest = async (id) => {
    const response = await axiosTransAdmin.delete(`/transaccion/${id}`);
    return response.data;
};

// Cancelar una transacción
export const cancelTransactionRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    if (isAdmin) {
        const response = await axiosTransAdmin.patch(`/transaccion/estado/${id}`, { estado: 'CANCELADA' });
        return response.data;
    } else {
        const response = await axiosTrans.patch(`/transaccion/estado/${id}`, { estado: 'CANCELADA' });
        return response.data;
    }
};