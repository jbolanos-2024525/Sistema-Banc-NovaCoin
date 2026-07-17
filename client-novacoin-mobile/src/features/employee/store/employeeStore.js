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
      console.log('Employees response:', response);
      console.log('Response data:', response.data);
      console.log('Response type:', typeof response);
      
      // Extraer datos de diferentes estructuras posibles
      let employeesData = response.data || response;
      if (Array.isArray(employeesData)) {
        console.log('Employees array length:', employeesData.length);
      } else if (employeesData.data && Array.isArray(employeesData.data)) {
        employeesData = employeesData.data;
        console.log('Employees nested array length:', employeesData.length);
      }
      
      set({ employees: employeesData, loading: false });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      set({ error: error.message, loading: false });
    }
  },

  createEmployee: async (dto) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating employee with DTO:', dto);
      console.log('DTO keys:', Object.keys(dto));
      console.log('DTO values:', Object.values(dto));
      
      // Limpiar datos eliminando campos no necesarios
      const cleanData = { ...dto };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }
      if (cleanData.hasOwnProperty('password')) {
        delete cleanData.password;
      }
      
      console.log('Cleaned DTO:', cleanData);
      const response = await employeeService.createEmployee(cleanData);
      console.log('Employee creation response:', response);
      
      // Si el empleado fue creado exitosamente, lo agregamos de inmediato a la lista del estado
      if (response.success || response.data) {
        const newEmployee = response.data || response;
        set((state) => ({
          employees: [newEmployee, ...state.employees],
          loading: false
        }));
      } else {
        await get().fetchEmployees();
      }
      return { success: true };
    } catch (error) {
      console.error('Error al crear empleado:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      set({ error: error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateEmployee: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      // Limpiar datos eliminando campos no necesarios
      const cleanData = { ...dto };
      if (cleanData.hasOwnProperty('Password')) {
        delete cleanData.Password;
      }
      if (cleanData.hasOwnProperty('password')) {
        delete cleanData.password;
      }
      
      const response = await employeeService.updateEmployee(id, cleanData);
      set((state) => ({
        employees: state.employees.map(e => (e._id || e.id) === id ? (response.data || response) : e),
        loading: false
      }));
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
      set((state) => ({
        employees: state.employees.filter(e => (e._id || e.id) !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
}));

