import { axiosAuth } from './api.js';

export const getUsers = async () => {
    const response = await axiosAuth.get('/auth/users');
    return response.data;
};