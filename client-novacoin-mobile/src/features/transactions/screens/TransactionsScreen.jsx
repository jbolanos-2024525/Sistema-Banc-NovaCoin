// src/features/transactions/screens/TransactionsScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useTransactionsStore } from '../store/transactionsStore';
import CreateTransactionModal from './CreateTransactionModal';

const TransactionsScreen = () => {
  const { transactions, loading, error, fetchTransactions } = useTransactionsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateTransaction = async (dto) => {
    const result = await useTransactionsStore.getState().executeTransaction(dto);
    if (result.success) {
      setIsModalOpen(false);
      await fetchTransactions();
    }
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

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionType}>{item.descripcion || item.tipo || item.tipoTransaccion || 'Transacción'}</Text>
        <View style={[styles.statusBadge, statusStyle(item.estado || item.estadoTransaccion || 'PENDIENTE')]}>
          <Text style={[styles.statusText, { color: statusStyle(item.estado || item.estadoTransaccion || 'PENDIENTE').color }]}>
            {item.estado || item.estadoTransaccion || 'PENDIENTE'}
          </Text>
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cuenta Origen:</Text>
          <Text style={styles.detailValue}>{item.cuentaOrigen || item.numeroCuenta || '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cuenta Destino:</Text>
          <Text style={styles.detailValue}>{item.cuentaDestino || '—'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Monto:</Text>
          <Text style={styles.detailAmount}>
            {item.monto ? `Q${Number(item.monto).toLocaleString('es-GT')}` : '—'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha:</Text>
          <Text style={styles.detailValue}>
            {item.fechaCreacion || item.createdAt ? new Date(item.fechaCreacion || item.createdAt).toLocaleDateString('es-GT') : '—'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateTransaction}
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
});

export default TransactionsScreen;
