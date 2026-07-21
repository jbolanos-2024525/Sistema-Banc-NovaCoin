import { axiosBank } from './api.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const BASE_ADMIN = '/prestamo';
const BASE_USER = '/prestamo';

export const getAllLoansRequest = async () => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    const base = isAdmin ? BASE_ADMIN : BASE_USER;
    const response = await axiosBank.get(base);
    return response.data;
};

export const getMyLoansRequest = async () => {
    const response = await axiosBank.get(`${BASE_USER}/mis-prestamos`);
    return response.data;
};

export const getLoanByIdRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    const base = isAdmin ? BASE_ADMIN : BASE_USER;
    const response = await axiosBank.get(`${base}/${id}`);
    return response.data;
};

export const createLoanRequest = async (loanData) => {
    const response = await axiosBank.post(BASE_USER, loanData);
    return response.data;
};

export const updateLoanRequest = async (id, loanData) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    const base = isAdmin ? BASE_ADMIN : BASE_USER;
    const response = await axiosBank.put(`${base}/${id}`, loanData);
    return response.data;
};

export const cancelLoanRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    const base = isAdmin ? BASE_ADMIN : BASE_USER;
    const response = await axiosBank.patch(`${base}/cancelar/${id}`);
    return response.data;
};

export const deleteLoanRequest = async (id) => {
    const user = useAuthStore.getState().user;
    const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');
    
    const base = isAdmin ? BASE_ADMIN : BASE_USER;
    const response = await axiosBank.delete(`${base}/${id}`);
    return response.data;
};

export const approveLoanRequest = async (id) => {
    const response = await axiosBank.patch(`${BASE_ADMIN}/estado/${id}`, { estadoPrestamo: 'ACTIVO' });
    return response.data;
};

export const rejectLoanRequest = async (id) => {
    const response = await axiosBank.patch(`${BASE_ADMIN}/estado/${id}`, { estadoPrestamo: 'RECHAZADO' });
    return response.data;
};