import { axiosAuth } from './api.js';

export const loginRequest = async (data) => {
    const response = await axiosAuth.post('/auth/login', data);
    return response.data;
};

export const registerRequest = async (data) => {
    const response = await axiosAuth.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const verifyEmailRequest = async (token) => {
    const response = await axiosAuth.post('/auth/verify-email', { token });
    return response;
};  

export const forgotPasswordRequest = async (email) => {
    const response = await axiosAuth.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPasswordRequest = async (token, newPassword) => {
    const response = await axiosAuth.post('/auth/reset-password', { token, newPassword });
    return response.data;
};