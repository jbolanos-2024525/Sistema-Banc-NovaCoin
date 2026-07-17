// src/features/employee/screens/EmployeeScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import EmployeeModal from './EmployeeModal';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const EmployeeScreen = ({ navigation }) => {
  const { employees, loading, fetchEmployees, updateEmployee, deleteEmployee, createEmployee } = useEmployeeStore();
  const { user } = useAuthStore();
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const isAdmin = user?.role === 'ADMIN_ROLE';

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreateEmployee = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setConfirmConfig({
      title: 'Editar Empleado',
      message: '¿Estás seguro de que deseas editar este empleado?',
      confirmText: 'Sí, Editar',
      confirmColor: '#f59e0b',
      onConfirm: () => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const handleSaveEmployee = async (formData) => {
    let result;
    if (employeeToEdit) {
      result = await updateEmployee(employeeToEdit._id || employeeToEdit.id, formData);
      if (result.success) {
        showToast('Empleado actualizado correctamente', 'success');
        setIsModalOpen(false);
        setEmployeeToEdit(null);
      } else {
        showToast(result.error || 'No se pudo actualizar el empleado', 'error');
      }
    } else {
      result = await createEmployee(formData);
      if (result.success) {
        showToast('Empleado creado correctamente', 'success');
        setIsModalOpen(false);
        setEmployeeToEdit(null);
      } else {
        showToast(result.error || 'No se pudo crear el empleado', 'error');
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    setConfirmConfig({
      title: 'Eliminar Empleado',
      message: '¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer.',
      confirmText: 'Sí, Eliminar',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        const result = await deleteEmployee(employeeId);
        if (result.success) {
          showToast('Empleado eliminado correctamente', 'success');
        } else {
          showToast(result.error || 'No se pudo eliminar el empleado', 'error');
        }
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const renderEmployee = ({ item }) => {
    // Extracción flexible de propiedades
    const nombre = item.Nombre || item.nombre || item.name || '—';
    const apellido = item.Apellido || item.apellido || item.surname || '';
    const puesto = item.Puesto || item.puesto || item.position || '—';
    const correo = item.Correo || item.correo || item.email || '—';
    const dpi = item.DPI || item.dpi || '—';
    const telefono = item.Telefono || item.telefono || item.phone || '—';
    const salario = item.Salario || item.salario || 0;
    const rol = item.Rol || item.rol || 'USER_ROLE';
    
    return (
      <View style={styles.employeeItem}>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{nombre} {apellido}</Text>
          <Text style={styles.employeePosition}>{puesto}</Text>
          <Text style={styles.employeeEmail}>{correo}</Text>
          <View style={styles.employeeDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>DPI:</Text>
              <Text style={styles.detailValue}>{dpi}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Teléfono:</Text>
              <Text style={styles.detailValue}>{telefono}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Salario:</Text>
              <Text style={styles.detailValue}>Q{Number(salario).toLocaleString('es-GT')}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: 'rgba(0,242,254,0.1)' }]}>
          <Text style={styles.roleText}>{rol.toUpperCase()}_ROLE</Text>
        </View>
        {isAdmin && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditEmployee(item)}>
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteEmployee(item._id || item.id)}>
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Empleados" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Empleados</Text>
          <Text style={styles.headerSubtitle}>Administra el equipo de trabajo de NovaCoin.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateEmployee}>
          <MaterialIcons name="add" size={20} color="#050c18" />
          <Text style={styles.addButtonText}>Nuevo Empleado</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de empleados */}
      <View style={styles.listContainer}>
        {loading && employees.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando empleados...</Text>
          </View>
        ) : employees.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="badge" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No hay empleados registrados</Text>
          </View>
        ) : (
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item._id || item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {confirmConfig && (
        <ConfirmModal
          isOpen={true}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          confirmColor={confirmConfig.confirmColor}
          onConfirm={confirmConfig.onConfirm}
          onClose={confirmConfig.onClose}
        />
      )}
      
      <Toast
        message={toast?.message}
        type={toast?.type}
        visible={toast?.visible}
        onHide={hideToast}
      />
      
      <EmployeeModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSave={handleSaveEmployee}
        loading={loading}
        employee={employeeToEdit}
      />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  contentContainer: {
    padding: 24,
    gap: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#00f2fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 6,
    marginTop: 16,
  },
  addButtonText: {
    color: '#050c18',
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  employeeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    padding: 16,
  },
  employeeInfo: {
    marginBottom: 12,
  },
  employeeName: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  employeePosition: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
  employeeEmail: {
    color: '#9ca3af',
    fontSize: 12,
  },
  employeeDetails: {
    marginTop: 8,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginRight: 8,
  },
  detailValue: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  roleText: {
    color: '#00f2fe',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#f59e0b',
    backgroundColor: 'transparent',
  },
  deleteButton: {
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 12,
  },
});

export default EmployeeScreen;
