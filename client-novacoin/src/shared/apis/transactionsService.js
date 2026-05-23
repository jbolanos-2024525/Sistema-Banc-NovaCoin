import { axiosTrans } from './api.js';

// Obtener todas las transacciones del usuario autenticado
export const getAllTransactionsRequest = async () => {
    const response = await axiosTrans.get('/transacciones');
    return response.data;
};

// Obtener los detalles de una sola transacción por ID
export const getTransactionByIdRequest = async (id) => {
    const response = await axiosTrans.get(`/transacciones/${id}`);
    return response.data;
};

// Crear una nueva transacción (Transferencia, Depósito, Retiro)
export const createTransactionRequest = async (transactionData) => {
    const response = await axiosTrans.post('/transacciones', transactionData);
    return response.data;
};