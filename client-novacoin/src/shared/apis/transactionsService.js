import { axiosTrans, axiosTransAdmin } from './api.js';

// Obtener todas las transacciones del usuario autenticado
export const getAllTransactionsRequest = async () => {
    const response = await axiosTrans.get('/transaccion/mis-transacciones');
    return response.data;
};

// Obtener los detalles de una sola transacción por ID
export const getTransactionByIdRequest = async (id) => {
    const response = await axiosTrans.get(`/transaccion/${id}`);
    return response.data;
};

// Crear una nueva transacción (Transferencia, Depósito, Retiro)
export const createTransactionRequest = async (transactionData) => {
    const response = await axiosTransAdmin.post('/transaccion', transactionData);
    return response.data;
};