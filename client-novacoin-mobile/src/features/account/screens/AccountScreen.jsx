// src/features/account/screens/AccountScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAccountStore } from '../store/accountStore';
import { useAuthStore } from '../../../shared/store/authStore';

const AccountScreen = () => {
  const { cuentas, fetchMisCuentas, formatCurrency } = useAccountStore();
  const tokenUser = useAuthStore((state) => state.user);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosNovaCoin = async () => {
      try {
        await Promise.all([
          fetchMisCuentas(),
          // TODO: Implementar llamada a API para obtener perfil detallado
          // axiosAuth.get("/auth/profile").then((response) => {
          //   if (response.data && response.data.data) {
          //     setDbUser(response.data.data);
          //   } else if (response.data) {
          //     setDbUser(response.data);
          //   }
          // })
        ]);
      } catch (error) {
        console.error('Error al sincronizar los datos de NovaCoin:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosNovaCoin();
  }, [fetchMisCuentas]);

  const usuarioFinal = dbUser || tokenUser;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f2fe" />
        <Text style={styles.loadingText}>Sincronizando cuentas con NovaCoin...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta Bancaria</Text>
        <Text style={styles.headerSubtitle}>
          Visualiza el estado financiero de tu perfil en <Text style={styles.highlight}>NovaCoin</Text>.
        </Text>
      </View>

      {/* Info del Usuario */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person" size={24} color="#00f2fe" />
          <Text style={styles.cardTitle}>Información del Usuario</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{usuarioFinal?.fullName || usuarioFinal?.name || '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{usuarioFinal?.username || '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{usuarioFinal?.email || '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono:</Text>
          <Text style={styles.infoValue}>{usuarioFinal?.phone || '—'}</Text>
        </View>
      </View>

      {/* Cuentas Bancarias */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="account-balance" size={24} color="#00f2fe" />
          <Text style={styles.cardTitle}>Mis Cuentas</Text>
        </View>
        {cuentas.length > 0 ? (
          cuentas.map((cuenta, index) => (
            <View key={cuenta._id || cuenta.id || index} style={styles.accountItem}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountNumber}>{cuenta.numeroCuenta || cuenta.accountNumber || '—'}</Text>
                <Text style={styles.accountType}>{cuenta.tipoCuenta || cuenta.type || '—'}</Text>
              </View>
              <View style={styles.accountBalance}>
                <Text style={styles.balanceLabel}>Saldo</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency ? formatCurrency(cuenta.saldo || cuenta.balance || 0) : `Q${Number(cuenta.saldo || cuenta.balance || 0).toLocaleString('es-GT')}`}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cuenta.estadoCuenta?.toUpperCase() === 'ACTIVA' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)' }]}>
                <Text style={[styles.statusText, { color: cuenta.estadoCuenta?.toUpperCase() === 'ACTIVA' ? '#22c55e' : '#f97316' }]}>
                  {cuenta.estadoCuenta || cuenta.estado || 'PENDIENTE'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="account-balance" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tienes cuentas registradas</Text>
          </View>
        )}
      </View>

      {/* Resumen */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <MaterialIcons name="account-balance-wallet" size={20} color="#00f2fe" />
          <Text style={styles.summaryLabel}>Saldo Total:</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency 
              ? formatCurrency(cuentas.reduce((sum, c) => sum + Number(c.saldo || c.balance || 0), 0))
              : `Q${cuentas.reduce((sum, c) => sum + Number(c.saldo || c.balance || 0), 0).toLocaleString('es-GT')}`
            }
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <MaterialIcons name="credit-card" size={20} color="#4facfe" />
          <Text style={styles.summaryLabel}>Total Cuentas:</Text>
          <Text style={styles.summaryValue}>{cuentas.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b111e',
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b111e',
  },
  loadingText: {
    color: '#00f2fe',
    marginTop: 16,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  highlight: {
    color: '#00f2fe',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  infoValue: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
  accountItem: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  accountInfo: {
    marginBottom: 12,
  },
  accountNumber: {
    color: '#00f2fe',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  accountType: {
    color: '#9ca3af',
    fontSize: 12,
  },
  accountBalance: {
    marginBottom: 12,
  },
  balanceLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
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
  summaryCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 14,
    flex: 1,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AccountScreen;
