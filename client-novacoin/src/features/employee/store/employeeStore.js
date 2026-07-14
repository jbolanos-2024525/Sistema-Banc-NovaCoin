import { create } from 'zustand';
import { axiosBank } from '../../../shared/apis/index.js';

const BASE = '/NovaCoin/Admin/v1/empleados';

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosBank.get(BASE);
      const dataArray = data.data || data;
      const activos = dataArray.filter(emp => emp.isActive !== false && emp.Estado !== false);
      set({ employees: activos, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  createEmployee: async (formData) => {
    set({ loading: true, error: null });
    try {
      const cleanData = { ...formData };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }

      const { data } = await axiosBank.post(BASE, cleanData);
      await get().fetchEmployees(); 
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const cleanData = { ...formData };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }

      const { data } = await axiosBank.put(`${BASE}/${id}`, cleanData);
      await get().fetchEmployees();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployeeSoft: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosBank.delete(`${BASE}/${id}`);
      await get().fetchEmployees();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  cancelEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosBank.patch(`${BASE}/estado/${id}`, { estado: 'INACTIVO' });
      await get().fetchEmployees();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },
}));