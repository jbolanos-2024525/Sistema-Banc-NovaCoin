// src/features/employees/screens/EmployeesList.jsx

import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, EmptyState } from '../../../shared/components/common/Common';
import { useEmployees } from '../hooks/useEmployees';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';

const EmployeesList = ({ navigation }) => {
  const { employees, loading, error, fetchEmployees } = useEmployees();
  const [confirmConfig, setConfirmConfig] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee) => {
    navigation.navigate('EmployeeDetail', { employeeId: employee.id, mode: 'edit' });
  };

  const handleDelete = (employee) => {
    setConfirmConfig({
      title: 'Eliminar Empleado',
      message: `¿Estás seguro de eliminar al empleado ${employee.name} ${employee.surname}? Esta acción es permanente e irreversible.`,
      confirmText: 'Sí, Eliminar',
      confirmColor: '#dc2626',
      onConfirm: async () => {
        // Aquí iría la lógica de eliminación
        console.log('Eliminar empleado:', employee.id);
        setConfirmConfig(null);
        showToast('Empleado eliminado correctamente', 'success');
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const onRefresh = useCallback(async () => {
    await fetchEmployees();
  }, [fetchEmployees]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.gray[500];
      case 'on-leave':
        return theme.colors.warning;
      default:
        return theme.colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'on-leave':
        return 'Permiso';
      default:
        return status;
    }
  };

  const renderEmployeeCard = ({ item }) => (
    <Card elevation="md" style={styles.employeeCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EmployeeDetail', { employeeId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.employeeHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary.main + '10' }]}>
            <MaterialIcons name="person" size={32} color={theme.colors.primary.main} />
          </View>
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{item.name} {item.surname}</Text>
            <Text style={styles.employeePosition}>{item.position}</Text>
            <Text style={styles.employeeDepartment}>{item.department}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <View style={styles.employeeFooter}>
          <View style={styles.contactItem}>
            <MaterialIcons name="email" size={16} color={theme.colors.gray[400]} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={16} color={theme.colors.gray[400]} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <MaterialIcons name="edit" size={16} color="#f59e0b" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <MaterialIcons name="delete" size={16} color="#dc2626" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <EmptyState
      message="No hay empleados registrados"
      icon={<MaterialIcons name="badge" size={64} color={theme.colors.gray[300]} />}
    />
  );

  if (loading && employees.length === 0) {
    return <Loading />;
  }

  return (
    <Container padding="md">
      <View style={styles.header}>
        <Text style={styles.title}>Empleados</Text>
      </View>

      {error && (
        <Card elevation="sm" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <FlatList
        data={employees}
        renderItem={renderEmployeeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={employees.length === 0 ? styles.emptyList : null}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de confirmación */}
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
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
  employeeCard: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  employeePosition: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  employeeDepartment: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs / 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  employeeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  chevron: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    marginTop: -12,
  },
  emptyList: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[700],
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 6,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EmployeesList;
