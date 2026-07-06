// src/features/loan/screens/LoanScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../../../shared/store/authStore';
import CreateLoanModal from '../../loans/screens/CreateLoanModal';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount ?? 0);

const formatDate = (dateString) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusStyle = (estado) => {
  const map = {
    ACTIVO: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
    PENDIENTE: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    PAGADO: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    VENCIDO: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
    CANCELADO: { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
  };
  return map[estado] || map['PENDIENTE'];
};

const tipoStyle = (tipo) => {
  const map = {
    PERSONAL: { color: '#a78bfa' },
    HIPOTECARIO: { color: '#fb923c' },
    VEHICULAR: { color: '#38bdf8' },
  };
  return map[tipo] || { color: '#9ca3af' };
};

const LoanScreen = () => {
  const { loans, loading, error, fetchLoans } = useLoanStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanToEdit, setLoanToEdit] = useState(null);

  const isAdmin = user?.role === 'ADMIN_ROLE';

  const handleCreateLoan = async (dto) => {
    const result = await useLoanStore.getState().requestLoan(dto);
    if (result.success) {
      setIsModalOpen(false);
      setLoanToEdit(null);
      await fetchLoans();
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const renderLoan = ({ item }) => {
    const estado = item.estadoPrestamo || item.estado || 'PENDIENTE';
    const s = statusStyle(estado);
    const t = tipoStyle(item.tipoPrestamo);
    const bloqueado = estado === 'CANCELADO' || estado === 'PAGADO';

    return (
      <View style={styles.loanItem}>
        <View style={styles.loanHeader}>
          <Text style={[styles.loanType, { color: t.color }]}>{item.tipoPrestamo || '---'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
            <Text style={[styles.statusText, { color: s.color }]}>{estado}</Text>
          </View>
        </View>
        <View style={styles.loanDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monto:</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.monto)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plazo:</Text>
            <Text style={styles.detailValue}>{item.plazoMeses} meses</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cuota:</Text>
            <Text style={styles.detailValue}>{formatCurrency(item.cuotaMensual)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{formatDate(item.fechaSolicitud || item.createdAt)}</Text>
          </View>
        </View>
        {isAdmin && (
          <View style={styles.loanActions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} disabled={bloqueado}>
              <Text style={[styles.actionButtonText, bloqueado && styles.actionButtonTextDisabled]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} disabled={bloqueado}>
              <Text style={[styles.actionButtonText, bloqueado && styles.actionButtonTextDisabled]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{isAdmin ? 'Préstamos' : 'Mis Préstamos'}</Text>
          <Text style={styles.headerSubtitle}>
            {isAdmin ? 'Administra los préstamos del sistema.' : 'Gestiona y solicita préstamos desde tu cuenta NovaCoin.'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
          <MaterialIcons name="add" size={20} color="#050c18" />
          <Text style={styles.addButtonText}>Solicitar Préstamo</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error" size={20} color="#fca5a5" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de préstamos */}
      {loading && loans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando préstamos...</Text>
        </View>
      ) : loans.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="request-page" size={40} color="#cbd5e1" />
          <Text style={styles.emptyText}>No hay préstamos registrados.</Text>
          <Text style={styles.emptySubtext}>Solicita el primer préstamo con el botón de arriba.</Text>
        </View>
      ) : (
        <FlatList
          data={loans}
          renderItem={renderLoan}
          keyExtractor={(item) => item._id || item.id}
          scrollEnabled={false}
        />
      )}

      <CreateLoanModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setLoanToEdit(null);
        }}
        onConfirm={handleCreateLoan}
        loanToEdit={loanToEdit}
      />
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
  errorBanner: {
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#991b1b',
    borderRadius: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: '#fca5a5',
    flex: 1,
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingText: {
    color: '#00f2fe',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  loanItem: {
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 12,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanType: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loanDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#9ca3af',
    fontSize: 13,
  },
  detailValue: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
  loanActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  editButton: {
    borderColor: '#f59e0b',
    backgroundColor: 'transparent',
  },
  cancelButton: {
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#f59e0b',
  },
  actionButtonTextDisabled: {
    color: '#4b5563',
  },
});

export default LoanScreen;
