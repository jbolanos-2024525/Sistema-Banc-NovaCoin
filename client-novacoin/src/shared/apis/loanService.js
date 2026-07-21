import { axiosBank, axiosLoanAdmin } from './api.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const BASE = '/prestamo';

export const getAllLoansRequest = async () => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

    if (isAdmin) {
        const response = await axiosLoanAdmin.get(BASE);
        return response.data;
    } else {
        const response = await axiosBank.get(`${BASE}/mis-prestamos`);
        return response.data;
    }
};

export const getMyLoansRequest = async () => {
    const response = await axiosBank.get(`${BASE}/mis-prestamos`);
    return response.data;
};

export const getLoanByIdRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

    if (isAdmin) {
        const response = await axiosLoanAdmin.get(`${BASE}/${id}`);
        return response.data;
    } else {
        const response = await axiosBank.get(`${BASE}/${id}`);
        return response.data;
    }
};

export const createLoanRequest = async (loanData) => {
    const response = await axiosBank.post(BASE, loanData);
    return response.data;
};

export const updateLoanRequest = async (id, loanData) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

    if (isAdmin) {
        const response = await axiosLoanAdmin.put(`${BASE}/${id}`, loanData);
        return response.data;
    } else {
        const response = await axiosBank.put(`${BASE}/${id}`, loanData);
        return response.data;
    }
};

export const cancelLoanRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

    if (isAdmin) {
        const response = await axiosLoanAdmin.patch(`${BASE}/cancelar/${id}`);
        return response.data;
    } else {
        const response = await axiosBank.patch(`${BASE}/cancelar/${id}`);
        return response.data;
    }
};

export const deleteLoanRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

    if (isAdmin) {
        const response = await axiosLoanAdmin.delete(`${BASE}/${id}`);
        return response.data;
    } else {
        const response = await axiosBank.delete(`${BASE}/${id}`);
        return response.data;
    }
};

export const approveLoanRequest = async (id) => {
    const response = await axiosLoanAdmin.patch(`${BASE}/estado/${id}`, { estadoPrestamo: 'ACTIVO' });
    return response.data;
};

export const rejectLoanRequest = async (id) => {
    const response = await axiosLoanAdmin.patch(`${BASE}/estado/${id}`, { estadoPrestamo: 'RECHAZADO' });
    return response.data;
};