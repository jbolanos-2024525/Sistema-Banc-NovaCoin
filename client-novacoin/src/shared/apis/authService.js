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