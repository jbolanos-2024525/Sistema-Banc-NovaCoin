import { useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import toast from 'react-hot-toast';

export const useEmployee = () => {
  const store = useEmployeeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const openCreateModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleSave = async (data) => {
    let result;
    if (selectedEmployee) {
      result = await store.updateEmployee(selectedEmployee._id, data);
      if (result.success) toast.success('Empleado actualizado correctamente.');
    } else {
      result = await store.createEmployee(data);
      if (result.success) toast.success('Empleado registrado. Revisa el correo de verificación.');
    }

    if (result.success) {
      closeModal();
      return true;
    } else {
      toast.error(result.error || 'Ocurrió un error en la operación.');
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este empleado?')) {
      const result = await store.deleteEmployeeSoft(id);
      if (result.success) {
        toast.success('Empleado eliminado (Soft Delete) correctamente.');
      } else {
        toast.error(result.error || 'Error al eliminar empleado.');
      }
    }
  };

  return {
    ...store,
    isModalOpen,
    selectedEmployee,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
  };
};