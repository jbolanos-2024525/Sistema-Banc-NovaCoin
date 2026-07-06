// src/features/dashboard/screens/UserDashboardHomeScreen.jsx

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { useAccountStore } from '../../account/store/accountStore';
import { useTransactionsStore } from '../../transactions/store/transactionsStore';
import { useLoanStore } from '../../loan/store/loanStore';

const aqua = '#00b4cc';

const fmt = (n) =>
  n >= 1_000_000
    ? `Q${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `Q${(n / 1_000).toFixed(1)}K`
      : `Q${Number(n).toLocaleString('es-GT')}`;

const StatCard = ({ icon, label, value, badge, accent, loading }) => (
  <View style={[styles.statCard, { borderTopColor: accent }]}>
    <View style={styles.statCardHeader}>
      <View style={[styles.statIcon, { backgroundColor: `${accent}24` }]}>
        <MaterialIcons name={icon} size={24} color={accent} />
      </View>
      {badge && (
        <View style={[styles.statBadge, { backgroundColor: accent }]}>
          <Text style={styles.statBadgeText}>{badge}</Text>
        </View>
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
        {tx.descripcion || tx.tipo || tx.tipoTransaccion || 'Transacción'}
      </Text>
      <Text style={styles.transactionSubtitle}>
        {tx.cuentaOrigen || tx.numeroCuenta || '—'} •{' '}
        <Text style={styles.transactionAmount}>
          {tx.monto ? `Q${Number(tx.monto).toLocaleString('es-GT')}` : '—'}
        </Text>
      </Text>
    </View>
    <View style={[styles.statusBadge, statusStyle(tx.estado || tx.estadoTransaccion || 'PENDIENTE')]}>
      <Text style={[styles.statusText, { color: statusStyle(tx.estado || tx.estadoTransaccion || 'PENDIENTE').color }]}>
        {tx.estado || tx.estadoTransaccion || 'PENDIENTE'}
      </Text>
    </View>
  </View>
);

const UserDashboardHomeScreen = () => {
  const user = useAuthStore((state) => state.user);
  const name = user?.fullName || user?.username || user?.email || 'Usuario';

  const { cuentas, fetchMisCuentas, loading: loadCuentas } = useAccountStore();
  const { transactions, fetchTransactions, loading: loadTx } = useTransactionsStore();
  const { loans, fetchLoans, loading: loadLoans } = useLoanStore();

  useEffect(() => {
    fetchMisCuentas();
    fetchTransactions();
    fetchLoans();
  }, []);

  const saldoTotal = cuentas.reduce((s, c) => s + Number(c.saldo || c.balance || 0), 0);
  const totalPrestamos = loans.reduce((s, l) => s + Number(l.montoPrestamo || l.monto || 0), 0);

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.fechaCreacion || b.createdAt || 0) - new Date(a.fechaCreacion || a.createdAt || 0))
    .slice(0, 5);

  const today = new Date().toLocaleDateString('es-GT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Bienvenido, <Text style={{ color: aqua }}>{name}</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            {cuentas.length > 0
              ? <>Cuenta: <Text style={styles.accountNumber}>{cuentas[0]?.numeroCuenta || cuentas[0]?.accountNumber || '—'}</Text></>
              : 'Cargando información de cuenta...'}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <MaterialIcons name="wifi" size={14} color="#22c55e" />
          <Text style={styles.statusText}>En Línea</Text>
        </View>
      </View>

      {/* Tarjetas */}
      <View style={styles.cardsContainer}>
        <StatCard
          icon="account-balance-wallet"
          label="Saldo Total en Cuentas"
          value={fmt(saldoTotal)}
          badge={cuentas.length > 0 ? 'Activa' : undefined}
          accent={aqua}
          loading={loadCuentas}
        />
        <StatCard
          icon="trending-up"
          label="Cartera de Préstamos"
          value={fmt(totalPrestamos)}
          badge={loans.length > 0 ? `${loans.length} préstamo${loans.length > 1 ? 's' : ''}` : undefined}
          accent="#6366f1"
          loading={loadLoans}
        />
        <StatCard
          icon="swap-horiz"
          label="Volumen Semanal"
          value={fmt(transactions.reduce((s, tx) => s + Number(tx.monto || 0), 0))}
          accent="#f59e0b"
          loading={loadTx}
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
          <Text style={styles.summaryLabel}>MIS CUENTAS</Text>
          <Text style={styles.summaryValue}>{loadCuentas ? '—' : cuentas.length}</Text>
          <Text style={[styles.summaryDetail, { color: aqua }]}>
            {cuentas.length > 0 ? `${cuentas.filter(c => (c.estadoCuenta || c.estado || '').toUpperCase() === 'ACTIVA').length} activas` : 'Sin cuentas'}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>SALDO PROMEDIO</Text>
          <Text style={styles.summaryValue}>
            {loadCuentas ? '—' : (cuentas.length > 0 ? fmt(saldoTotal / cuentas.length) : 'Q0')}
          </Text>
          <Text style={[styles.summaryDetail, { color: '#4facfe' }]}>
            sobre {cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>MIS PRÉSTAMOS</Text>
          <Text style={styles.summaryValue}>{loadLoans ? '—' : loans.length}</Text>
          <Text style={[styles.summaryDetail, { color: '#6366f1' }]}>
            {loans.length > 0
              ? `${loans.filter(l => (l.estadoPrestamo || l.estado || '').toUpperCase() === 'ACTIVO').length} activos`
              : 'Sin préstamos'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  accountNumber: {
    color: '#374151',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  cardsContainer: {
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
    borderTopWidth: 3,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  statBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
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
    alignItems: 'center',
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
    color: '#94a3b8',
  },
  transactionAmount: {
    color: '#475569',
    fontWeight: '600',
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

export default UserDashboardHomeScreen;
