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
      const { data: json } = await axiosBank.get(BASE);
      if (json.success) {
        const dataArray = json.data || [];
        const activos = dataArray.filter(emp => emp.isActive !== false);
        set({ employees: activos, loading: false });
      } else {
        set({ error: json.message || 'Error desconocido', loading: false });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  createEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      const cleanData = { ...data };
      delete cleanData.Password;

      const { data: json } = await axiosBank.post(BASE, cleanData);
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message;
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const cleanData = { ...data };
      delete cleanData.Password;

      const { data: json } = await axiosBank.put(`${BASE}/${id}`, cleanData);
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message;
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployeeSoft: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data: json } = await axiosBank.put(`${BASE}/${id}`, { isActive: false });
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      set({ loading: false });
    }
  },
}));
