import { axiosBank } from './api.js';

const BASE = '/NovaCoin/Admin/v1/prestamo';

export const getAllLoansRequest = async () => {
    const response = await axiosBank.get(BASE);
    return response.data;
};

export const getLoanByIdRequest = async (id) => {
    const response = await axiosBank.get(`${BASE}/${id}`);
    return response.data;
};

export const createLoanRequest = async (loanData) => {
    const response = await axiosBank.post(BASE, loanData);
    return response.data;
};

export const updateLoanRequest = async (id, loanData) => {
    const response = await axiosBank.put(`${BASE}/${id}`, loanData);
    return response.data;
};

export const cancelLoanRequest = async (id) => {
    const response = await axiosBank.patch(`${BASE}/${id}/cancelar`);
    return response.data;
};

export const deleteLoanRequest = async (id) => {
    const response = await axiosBank.delete(`${BASE}/${id}`);
    return response.data;
};