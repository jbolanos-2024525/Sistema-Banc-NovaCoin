// src/features/employees/screens/EmployeeDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, Header } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useEmployees } from '../hooks/useEmployees';

const EmployeeDetail = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const { getEmployeeById, loading, error } = useEmployees();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    loadEmployeeDetail();
  }, [employeeId]);

  const loadEmployeeDetail = useCallback(async () => {
    try {
      const employeeData = await getEmployeeById(employeeId);
      setEmployee(employeeData);
    } catch (err) {
      console.error('Error al cargar detalle de empleado:', err);
    }
  }, [employeeId, getEmployeeById]);

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

  if (loading && !employee) {
    return <Loading />;
  }

  if (!employee) {
    return (
      <Container padding="md">
        <Card elevation="md">
          <Text style={styles.errorText}>No se pudo cargar el empleado</Text>
        </Card>
      </Container>
    );
  }

  return (
    <ScrollView>
      <Container padding="md">
        <Header
          title="Detalle de Empleado"
          subtitle={`${employee.name} ${employee.surname}`}
        />

        {error && (
          <Card elevation="sm" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Card elevation="lg" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary.main + '10' }]}>
              <MaterialIcons name="person" size={64} color={theme.colors.primary.main} />
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(employee.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(employee.status) }]}>
                {getStatusText(employee.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.employeeName}>{employee.name} {employee.surname}</Text>
          <Text style={styles.employeePosition}>{employee.position}</Text>
          <Text style={styles.employeeDepartment}>{employee.department}</Text>
        </Card>

        <Card elevation="md" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información Personal</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{employee.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{employee.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de Contratación</Text>
            <Text style={styles.infoValue}>{new Date(employee.hireDate).toLocaleDateString('es-GT')}</Text>
          </View>
        </Card>

        {employee.stats && (
          <Card elevation="md" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Estadísticas</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons name="account-balance" size={32} color={theme.colors.primary.main} />
                <Text style={styles.statLabel}>Cuentas Atendidas</Text>
                <Text style={styles.statValue}>{employee.stats.accountsHandled || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="swap-horiz" size={32} color={theme.colors.success} />
                <Text style={styles.statLabel}>Transacciones</Text>
                <Text style={styles.statValue}>{employee.stats.transactions || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="star" size={32} color={theme.colors.secondary.main} />
                <Text style={styles.statLabel}>Calificación</Text>
                <Text style={styles.statValue}>{employee.stats.rating || 'N/A'}</Text>
              </View>
            </View>
          </Card>
        )}

        <Card elevation="md" style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Acciones</Text>
          
          <Button
            title="Enviar Mensaje"
            onPress={() => {}}
            variant="outline"
            icon={<MaterialIcons name="message" size={20} color={theme.colors.primary.main} />}
            style={styles.actionButton}
          />

          <Button
            title="Llamar"
            onPress={() => {}}
            variant="outline"
            icon={<MaterialIcons name="phone" size={20} color={theme.colors.primary.main} />}
            style={styles.actionButton}
          />
        </Card>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
  profileCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  employeeName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  employeePosition: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  employeeDepartment: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.xs / 2,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
  },
  statsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  actionsCard: {
    marginBottom: theme.spacing.lg,
  },
  actionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default EmployeeDetail;
