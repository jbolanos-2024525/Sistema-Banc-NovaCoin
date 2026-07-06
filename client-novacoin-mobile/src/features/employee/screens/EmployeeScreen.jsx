// src/features/employee/screens/EmployeeScreen.jsx

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useEmployeeStore } from '../store/employeeStore';

const EmployeeScreen = ({ navigation }) => {
  const { employees, loading, fetchEmployees } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeItem}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.Nombre || item.name || '—'} {item.Apellido || item.surname || ''}</Text>
        <Text style={styles.employeePosition}>{item.Puesto || item.position || '—'}</Text>
        <Text style={styles.employeeEmail}>{item.Correo || item.email || '—'}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: 'rgba(0,242,254,0.1)' }]}>
        <Text style={styles.roleText}>{item.Rol ? `${item.Rol.toUpperCase()}_ROLE` : 'USER_ROLE'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Empleados</Text>
          <Text style={styles.headerSubtitle}>Administra el equipo de trabajo de NovaCoin.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateEmployee')}>
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
    </ScrollView>
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
    borderColor: '#6b7280',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
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
