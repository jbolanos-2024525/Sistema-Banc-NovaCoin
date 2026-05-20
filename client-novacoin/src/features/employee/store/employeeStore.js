import { create } from 'zustand';

const API_URL = 'http://localhost:3020/api/empleados'; 

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) {
        const activos = json.data.filter(emp => emp.isActive !== false);
        set({ employees: activos, loading: false });
      } else {
        set({ error: json.message, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        await get().fetchEmployees(); 
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployeeSoft: async (id) => {
    set({ loading: true, error: null });
    try {
    
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false }), 
      });
      const json = await res.json();
      if (json.success) {
        await get().fetchEmployees();
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },
}));