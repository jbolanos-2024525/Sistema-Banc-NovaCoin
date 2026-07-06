// src/features/adminAccount/screens/AdminAccountScreen.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAdminAccountStore } from '../store/adminAccountStore';

const AdminAccountScreen = ({ navigation }) => {
  const { cuentas, loading, fetchCuentas, formatCurrency } = useAdminAccountStore();
  const [filterUsuarioId, setFilterUsuarioId] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const renderAccount = ({ item }) => (
    <View style={styles.accountItem}>
      <View style={styles.accountInfo}>
        <Text style={styles.accountNumber}>{item.numeroCuenta || item.accountNumber || '—'}</Text>
        <Text style={styles.accountType}>{item.tipoCuenta || item.type || '—'}</Text>
        <Text style={styles.accountUser}>Usuario: {item.usuarioId || item.userId || '—'}</Text>
      </View>
      <View style={styles.accountBalance}>
        <Text style={styles.balanceValue}>
          {formatCurrency ? formatCurrency(item.saldo || item.balance || 0) : `Q${Number(item.saldo || item.balance || 0).toLocaleString('es-GT')}`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: item.estadoCuenta?.toUpperCase() === 'ACTIVA' ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)' }]}>
          <Text style={[styles.statusText, { color: item.estadoCuenta?.toUpperCase() === 'ACTIVA' ? '#22c55e' : '#f97316' }]}>
            {item.estadoCuenta || item.estado || 'PENDIENTE'}
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
          <Text style={styles.headerTitle}>Gestión de Cuentas</Text>
          <Text style={styles.headerSubtitle}>Crear, editar y administrar cuentas bancarias de los usuarios.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateAccount')}>
          <MaterialIcons name="add" size={20} color="#0d1117" />
          <Text style={styles.addButtonText}>Nueva Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Mensaje de éxito */}
      {successMsg && (
        <View style={styles.successBanner}>
          <MaterialIcons name="check-circle" size={20} color="#00f2fe" />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}

      {/* Filtro por Usuario */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por ID de Usuario:</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="UUID del usuario..."
          value={filterUsuarioId}
          onChangeText={setFilterUsuarioId}
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonSecondary]}>
          <Text style={styles.filterButtonTextSecondary}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de cuentas */}
      <View style={styles.listContainer}>
        <Text style={styles.listCount}>
          {loading ? 'Cargando...' : `${cuentas.length} cuenta(s) encontrada(s)`}
        </Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando cuentas...</Text>
          </View>
        ) : cuentas.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="account-balance" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No hay cuentas registradas</Text>
          </View>
        ) : (
          <FlatList
            data={cuentas}
            renderItem={renderAccount}
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
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#0d1117',
    fontWeight: '700',
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: 'rgba(0,242,254,0.1)',
    borderWidth: 1,
    borderColor: '#00f2fe',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successText: {
    color: '#00f2fe',
    fontSize: 14,
    flex: 1,
  },
  filterContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    padding: 16,
    gap: 12,
  },
  filterLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    color: '#f3f4f6',
    fontSize: 13,
    padding: 12,
  },
  filterButton: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#e5e7eb',
    fontSize: 13,
  },
  filterButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterButtonTextSecondary: {
    color: '#9ca3af',
    fontSize: 13,
  },
  listContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  listCount: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
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
    marginBottom: 4,
  },
  accountUser: {
    color: '#6b7280',
    fontSize: 11,
  },
  accountBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 14,
    marginTop: 12,
  },
});

export default AdminAccountScreen;
