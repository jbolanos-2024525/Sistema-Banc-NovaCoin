import { axiosBank } from './api';

export const getUsers = async () => {
    const response = await axiosBank.get('/users');

    return response.data;
};

