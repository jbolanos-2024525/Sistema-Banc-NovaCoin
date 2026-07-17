// src/features/transactions/screens/TransactionsScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useTransactionsStore } from '../store/transactionsStore';
import { useAuthStore } from '../../../shared/store/authStore';
import CreateTransactionModal from './CreateTransactionModal';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const TransactionsScreen = () => {
  const { transactions, loading, error, fetchTransactions } = useTransactionsStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const isAdmin = user?.role === 'ADMIN_ROLE';

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateTransaction = async (dto) => {
    let result;
    if (transactionToEdit) {
      // Editar transacción existente
      result = await useTransactionsStore.getState().updateTransaction(transactionToEdit._id || transactionToEdit.id, dto);
      if (result.success) {
        showToast('Transacción actualizada correctamente.', 'success');
        setIsModalOpen(false);
        setTransactionToEdit(null);
        await fetchTransactions();
      } else {
        showToast(result.error || 'No se pudo actualizar la transacción.', 'error');
      }
    } else {
      // Crear nueva transacción
      result = await useTransactionsStore.getState().executeTransaction(dto);
      if (result.success) {
        showToast('Transacción creada correctamente.', 'success');
        setIsModalOpen(false);
        setTransactionToEdit(null);
        await fetchTransactions();
      } else {
        showToast(result.error || 'No se pudo crear la transacción.', 'error');
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setConfirmConfig({
      title: 'Editar Transacción',
      message: '¿Estás seguro de que deseas editar esta transacción?',
      confirmText: 'Sí, Editar',
      confirmColor: '#f59e0b',
      onConfirm: () => {
        setTransactionToEdit(transaction);
        setIsModalOpen(true);
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const handleCancelTransaction = async (transactionId) => {
    setConfirmConfig({
      title: 'Cancelar Transacción',
      message: '¿Estás seguro de que deseas cancelar esta transacción?',
      confirmText: 'Sí, Cancelar',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        const result = await useTransactionsStore.getState().cancelTransaction(transactionId);
        if (result.success) {
          showToast('Transacción cancelada correctamente.', 'success');
          await fetchTransactions();
        } else {
          showToast(result.error || 'No se pudo cancelar la transacción', 'error');
        }
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const handleDeleteTransaction = async (transactionId) => {
    setConfirmConfig({
      title: 'Eliminar Transacción',
      message: '¿Estás seguro de que deseas eliminar esta transacción? Esta acción no se puede deshacer.',
      confirmText: 'Sí, Eliminar',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        const result = await useTransactionsStore.getState().deleteTransaction(transactionId);
        if (result.success) {
          showToast('Transacción eliminada correctamente.', 'success');
          await fetchTransactions();
        } else {
          showToast(result.error || 'No se pudo eliminar la transacción', 'error');
        }
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const statusStyle = (status) => {
    const s = status?.toUpperCase();
    const map = {
      PENDIENTE: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
      PROCESANDO: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
      APROBADO: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
      ACTIVO: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
      PAGADO: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
      RECHAZADO: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
      EN_MORA: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
      CANCELADO: { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
    };
    const cfg = map[s] || map.PENDIENTE;
    return {
      backgroundColor: cfg.bg,
      color: cfg.color,
    };
  };

  const renderTransaction = ({ item }) => {
    // Extracción flexible de propiedades (PascalCase y minúsculas) como en el web
    const tipoTransaccion = item.TipoTransaccion || item.tipoTransaccion;
    const isTransferencia = tipoTransaccion === 'TRANSFERENCIA';
    const isRetiro = tipoTransaccion === 'RETIRO';
    
    const realDate = item.fecha || item.Fecha || item.fechaCreacion || item.FechaCreacion || item.createdAt || item.CreatedAt;
    const numeroCuenta = item.CuentaDestino || item.cuentaDestino || item.CuentaOrigen || item.cuentaOrigen || item.NumeroCuenta || item.numeroCuenta || null;
    const descripcion = item.Descripcion || item.descripcion || 'Sin descripción';
    const moneda = item.Moneda || item.moneda || 'GTQ';
    const monto = item.Monto || item.monto;
    const estado = item.EstadoTransaccion || item.estadoTransaccion || item.estado || 'COMPLETADA';
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <View style={styles.typeBadge}>
            <Text style={[styles.typeBadgeText, isTransferencia && styles.typeTransferencia, isRetiro && styles.typeRetiro]}>
              {tipoTransaccion}
            </Text>
          </View>
          <View style={[styles.statusBadge, statusStyle(estado)]}>
            <Text style={[styles.statusText, { color: statusStyle(estado).color }]}>
              {estado}
            </Text>
          </View>
        </View>
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cuenta:</Text>
            <Text style={styles.detailValue}>{numeroCuenta || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Descripción:</Text>
            <Text style={styles.detailValue}>{descripcion}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Moneda:</Text>
            <Text style={styles.detailValue}>{moneda}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monto:</Text>
            <Text style={[styles.detailAmount, (isTransferencia || isRetiro) && styles.detailAmountNegative]}>
              {(isTransferencia || isRetiro) ? '- ' : '+ '}
              {monto ? `Q${Number(monto).toLocaleString('es-GT')}` : '—'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>
              {realDate ? new Date(realDate).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
            </Text>
          </View>
        </View>
        {isAdmin && (
          <View style={styles.transactionActions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditTransaction(item)}>
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => handleCancelTransaction(item._id || item.id)}>
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteTransaction(item._id || item.id)}>
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Transacciones" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Historial de Transacciones</Text>
          <Text style={styles.headerSubtitle}>Monitorea y gestiona todos los movimientos de tus cuentas en tiempo real.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
          <MaterialIcons name="add" size={20} color="#050c18" />
          <Text style={styles.addButtonText}>Nueva Transacción</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <MaterialIcons name="error" size={20} color="#fca5a5" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de transacciones */}
      {loading && transactions.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando movimientos financieros...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="swap-horiz" size={40} color="#cbd5e1" />
          <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id || item.id}
          scrollEnabled={false}
        />
      )}

      <CreateTransactionModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTransactionToEdit(null);
        }}
        onConfirm={handleCreateTransaction}
        isAdmin={isAdmin}
        transaction={transactionToEdit}
      />

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
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  transactionItem: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionType: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  transactionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  detailValue: {
    color: '#e5e7eb',
    fontSize: 13,
  },
  detailAmount: {
    color: '#00f2fe',
    fontSize: 14,
    fontWeight: '700',
  },
  detailAmountNegative: {
    color: '#f87171',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34d399',
  },
  typeTransferencia: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
  },
  typeRetiro: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
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
  deleteButton: {
    borderColor: '#6b7280',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#f59e0b',
  },
});

export default TransactionsScreen;
