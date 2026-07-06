// src/features/employee/store/employeeStore.js

import { create } from 'zustand';
import { employeeService } from '../../../shared/api/employeeClient';

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await employeeService.getEmployees();
      set({ employees: response.data || response, loading: false });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      set({ error: error.message, loading: false });
    }
  },

  createEmployee: async (dto) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating employee with DTO:', dto);
      const response = await employeeService.createEmployee(dto);
      console.log('Employee creation response:', response);
      await get().fetchEmployees();
      return { success: true };
    } catch (error) {
      console.error('Error al crear empleado:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      set({ error: error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateEmployee: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const response = await employeeService.updateEmployee(id, dto);
      await get().fetchEmployees();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await employeeService.deleteEmployee(id);
      await get().fetchEmployees();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));

