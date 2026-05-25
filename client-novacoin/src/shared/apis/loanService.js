import { axiosBank } from './api.js';

const BASE = '/NovaCoin/Admin/v1/prestamo';

// Obtener todos los préstamos
export const getAllLoansRequest = async () => {
    const response = await axiosBank.get(BASE);
    return response.data;
};

// Obtener préstamo por ID
export const getLoanByIdRequest = async (id) => {
    const response = await axiosBank.get(`${BASE}/${id}`);
    return response.data;
};

// Crear nuevo préstamo
export const createLoanRequest = async (loanData) => {
    const response = await axiosBank.post(BASE, loanData);
    return response.data;
};

// Cancelar préstamo
export const cancelLoanRequest = async (id) => {
    const response = await axiosBank.patch(`${BASE}/${id}/cancelar`);
    return response.data;
};