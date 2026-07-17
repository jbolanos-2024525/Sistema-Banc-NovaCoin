// src/features/dashboard/screens/DashboardHomeScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useTransactionsStore } from '../../transactions/store/transactionsStore';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const aqua = '#00f2fe';

const fmt = (n) =>
  n >= 1_000_000
    ? `Q${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `Q${(n / 1_000).toFixed(1)}K`
      : `Q${n.toLocaleString('es-GT')}`;

const StatCard = ({ icon, label, value, sub, color, loading }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statCardHeader}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      {sub && (
        <Text style={[styles.statBadge, { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }]}>
          {sub}
        </Text>
      )}
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>
      {loading ? 'Cargando...' : value}
    </Text>
  </View>
);

const statusStyle = (status) => {
  const s = status?.toUpperCase();
  const map = {
    PENDIENTE: { bg: '#fff7ed', color: '#f97316' },
    PROCESANDO: { bg: '#fff7ed', color: '#f97316' },
    APROBADO: { bg: '#f0fdf4', color: '#22c55e' },
    ACTIVO: { bg: '#f0fdf4', color: '#22c55e' },
    PAGADO: { bg: '#eff6ff', color: '#3b82f6' },
    RECHAZADO: { bg: '#fef2f2', color: '#ef4444' },
    EN_MORA: { bg: '#fef2f2', color: '#ef4444' },
    CANCELADO: { bg: '#f8fafc', color: '#94a3b8' },
  };
  const cfg = map[s] || map.PENDIENTE;
  return {
    backgroundColor: cfg.bg,
    color: cfg.color,
  };
};

const TransactionItem = ({ tx }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionInfo}>
      <Text style={styles.transactionTitle}>
        {tx.Descripcion || tx.descripcion || tx.TipoTransaccion || tx.tipoTransaccion || 'Transacción'}
      </Text>
      <Text style={styles.transactionSubtitle}>
        Usuario: {tx.Usuario || tx.usuario || '—'}
      </Text>
      {(tx.CuentaOrigen || tx.CuentaDestino) && (
        <Text style={styles.transactionDetails}>
          {tx.CuentaOrigen ? `Origen: ${tx.CuentaOrigen}` : ''}
          {tx.CuentaOrigen && tx.CuentaDestino ? ' • ' : ''}
          {tx.CuentaDestino ? `Destino: ${tx.CuentaDestino}` : ''}
        </Text>
      )}
      <Text style={styles.transactionDate}>
        {tx.FechaTransaccion || tx.fechaCreacion || tx.createdAt 
          ? new Date(tx.FechaTransaccion || tx.fechaCreacion || tx.createdAt).toLocaleDateString('es-GT', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '—'}
      </Text>
    </View>
    <View style={styles.transactionRight}>
      <Text style={styles.transactionAmount}>
        {tx.Monto || tx.monto ? `Q${Number(tx.Monto || tx.monto).toLocaleString('es-GT')}` : '—'}
      </Text>
      <View style={[styles.statusBadge, statusStyle(tx.EstadoTransaccion || tx.estadoTransaccion || tx.estado || 'PENDIENTE')]}>
        <Text style={[styles.statusText, { color: statusStyle(tx.EstadoTransaccion || tx.estadoTransaccion || tx.estado || 'PENDIENTE').color }]}>
          {tx.EstadoTransaccion || tx.estadoTransaccion || tx.estado || 'PENDIENTE'}
        </Text>
      </View>
    </View>
  </View>
);

const DashboardHomeScreen = () => {
  const { transactions, fetchTransactions, loading: loadTx } = useTransactionsStore();
  const [loading, setLoading] = useState(true);

  // Datos simulados para el dashboard admin
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalCuentas: 0,
    totalEmpleados: 0,
    carteraTotal: 0,
  });

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      try {
        await fetchTransactions();
        // TODO: Implementar llamadas reales a API cuando los stores estén disponibles
        setStats({
          totalUsuarios: 156,
          totalCuentas: 89,
          totalEmpleados: 12,
          carteraTotal: 2450000,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Actualizar transacciones cada 10 segundos para tiempo real
    const interval = setInterval(() => {
      fetchTransactions();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchTransactions]);

  const { totalUsuarios, totalCuentas, totalEmpleados, carteraTotal } = stats;

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.fechaCreacion || b.createdAt || 0) - new Date(a.fechaCreacion || a.createdAt || 0))
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <CustomHeader title="Inicio" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Centro de Control Operativo</Text>
          <Text style={styles.headerSubtitle}>
            Estado de red Novacoin: <Text style={styles.onlineStatus}>● En Línea</Text>
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="people"
          label="Usuarios Registrados"
          value={totalUsuarios}
          sub={totalUsuarios > 0 ? `+${totalUsuarios}` : undefined}
          color={aqua}
          loading={loading}
        />
        <StatCard
          icon="account-balance"
          label="Cuentas Bancarias"
          value={totalCuentas}
          color="#4facfe"
          loading={loading}
        />
        <StatCard
          icon="swap-horiz"
          label="Cartera Total"
          value={fmt(carteraTotal)}
          color="#8b5cf6"
          loading={loading}
        />
        <StatCard
          icon="work"
          label="Empleados Activos"
          value={totalEmpleados}
          color="#10b981"
          loading={loading}
        />
      </View>

      {/* Transacciones Recientes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Transacciones Recientes</Text>
          {loadTx && <Text style={styles.cardSubtitle}>Actualizando...</Text>}
        </View>
        {recentTx.length > 0 ? (
          recentTx.map((tx, i) => (
            <TransactionItem key={tx._id || tx.id || i} tx={tx} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              {loadTx ? 'Cargando transacciones...' : 'No hay transacciones recientes'}
            </Text>
          </View>
        )}
      </View>

      {/* Resumen inferior */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>USUARIOS ACTIVOS</Text>
          <Text style={styles.summaryValue}>{loading ? '—' : totalUsuarios}</Text>
          <Text style={[styles.summaryDetail, { color: aqua }]}>
            {loading ? '—' : `${Math.floor(totalUsuarios * 0.85)} verificados`}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>BALANCE PROMEDIO</Text>
          <Text style={styles.summaryValue}>
            {loading ? '—' : (totalCuentas > 0 ? fmt(carteraTotal / totalCuentas) : 'Q0')}
          </Text>
          <Text style={[styles.summaryDetail, { color: '#4facfe' }]}>
            sobre {totalCuentas} cuentas
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>EMPLEADOS EN SERVICIO</Text>
          <Text style={styles.summaryValue}>{loading ? '—' : totalEmpleados}</Text>
          <Text style={[styles.summaryDetail, { color: '#10b981' }]}>
            empleados activos
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
    gap: 20,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: aqua,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  onlineStatus: {
    color: '#10b981',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    padding: 8,
    borderRadius: 10,
  },
  statBadge: {
    fontSize: 10,
    fontWeight: '700',
    padding: 4,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  transactionDetails: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 6,
  },
  summaryDetail: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DashboardHomeScreen;
