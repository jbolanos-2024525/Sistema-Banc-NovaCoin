import { create } from 'zustand';
import { getUsers } from '../../../shared/apis/usersService';

export const useUserManagementStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getUsers();

      const raw = res?.data ?? res;

      const usersArray = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.users)
          ? raw.users
          : Array.isArray(raw?.data?.users)
            ? raw.data.users
            : [];

      set({
        users: usersArray,
        loading: false,
      });

    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al obtener usuarios',
        users: [],
        loading: false,
      });
    }
  },
}));