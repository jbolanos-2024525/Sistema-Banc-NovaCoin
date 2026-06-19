// src/features/employees/hooks/useEmployees.js

import { useState, useCallback } from 'react';
import { employeeService } from '../../../shared/api/employeeClient';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.getEmployees(params);
      const data = response.data.data || response.data;
      
      const mappedEmployees = data.map((employee) => ({
        id: employee.id,
        name: employee.name,
        surname: employee.surname,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        hireDate: employee.hireDate,
        status: employee.status,
      }));
      
      setEmployees(mappedEmployees);
      return mappedEmployees;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar empleados';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEmployeeById = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.getEmployeeById(employeeId);
      const data = response.data.data || response.data;
      
      const mappedEmployee = {
        id: data.id,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        position: data.position,
        department: data.department,
        hireDate: data.hireDate,
        status: data.status,
        stats: data.stats || {},
      };
      
      return mappedEmployee;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar empleado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.createEmployee(employeeData);
      const data = response.data.data || response.data;
      
      await fetchEmployees();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear empleado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (employeeId, employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.updateEmployee(employeeId, employeeData);
      const data = response.data.data || response.data;
      
      await fetchEmployees();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar empleado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees]);

  const deleteEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.deleteEmployee(employeeId);
      const data = response.data.data || response.data;
      
      await fetchEmployees();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar empleado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees]);

  const getEmployeeStats = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeService.getEmployeeStats(employeeId);
      const data = response.data.data || response.data;
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar estadísticas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats,
  };
};

export default useEmployees;
