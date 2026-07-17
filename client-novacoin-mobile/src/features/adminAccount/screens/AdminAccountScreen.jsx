// src/features/adminAccount/screens/AdminAccountScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAdminAccountStore } from '../store/adminAccountStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import EditAccountModal from './EditAccountModal';
import CreateAccount from '../../accounts/screens/CreateAccount';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const AdminAccountScreen = ({ navigation }) => {
  const { cuentas, loading, fetchCuentas, formatCurrency, createCuenta, updateCuenta, deleteCuenta } = useAdminAccountStore();
  const { user } = useAuthStore();
  const [filterUsuarioId, setFilterUsuarioId] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const isAdmin = user?.role === 'ADMIN_ROLE';

  useEffect(() => {
    fetchCuentas();
  }, [fetchCuentas]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSearchByUserId = async () => {
    if (!filterUsuarioId.trim()) {
      await fetchCuentas();
      return;
    }
    // Filtrar localmente por ID de usuario
    const filtered = cuentas.filter(c => 
      (c.IdUsuario || c.idUsuario || c.usuarioId || c.userId) === filterUsuarioId.trim()
    );
    // Si no se encuentra, mostrar mensaje
    if (filtered.length === 0) {
      showToast('No se encontraron cuentas para este usuario', 'error');
    }
  };

  const handleClearFilter = async () => {
    setFilterUsuarioId('');
    await fetchCuentas();
  };

  const handleEditAccount = (account) => {
    setConfirmConfig({
      title: 'Editar Cuenta',
      message: '¿Estás seguro de que deseas editar esta cuenta?',
      confirmText: 'Sí, Editar',
      confirmColor: '#f59e0b',
      onConfirm: () => {
        setAccountToEdit(account);
        setIsModalOpen(true);
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const handleUpdateAccount = async (formData) => {
    const result = await updateCuenta(accountToEdit._id || accountToEdit.id, formData);
    if (result.success) {
      showToast('Cuenta actualizada correctamente', 'success');
      setIsModalOpen(false);
      setAccountToEdit(null);
      await fetchCuentas();
    } else {
      showToast(result.error || 'No se pudo actualizar la cuenta', 'error');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    setConfirmConfig({
      title: 'Eliminar Cuenta',
      message: '¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer.',
      confirmText: 'Sí, Eliminar',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        const result = await deleteCuenta(accountId);
        if (result.success) {
          showToast('Cuenta eliminada correctamente', 'success');
        } else {
          showToast(result.error || 'No se pudo eliminar la cuenta', 'error');
        }
        setConfirmConfig(null);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const renderAccount = ({ item }) => {
    // Extracción flexible de propiedades como en el web
    const numeroCuenta = item.NumeroCuenta || item.numeroCuenta || item.accountNumber || '—';
    const tipoCuenta = item.TipoCuenta || item.tipoCuenta || item.type || '—';
    const moneda = item.Moneda || item.moneda || 'GTQ';
    const saldo = item.Saldo || item.saldo || item.balance || 0;
    const estadoCuenta = item.EstadoCuenta || item.estadoCuenta || item.estado || 'PENDIENTE';
    const idUsuario = item.IdUsuario || item.idUsuario || item.usuarioId || item.userId || '—';
    
    const estadoColor = estadoCuenta?.toUpperCase() === 'ACTIVA' ? '#22c55e' : 
                      estadoCuenta?.toUpperCase() === 'BLOQUEADA' ? '#f97316' : 
                      estadoCuenta?.toUpperCase() === 'CANCELADA' ? '#ef4444' : '#9ca3af';
    const estadoBg = estadoCuenta?.toUpperCase() === 'ACTIVA' ? 'rgba(34,197,94,0.1)' : 
                    estadoCuenta?.toUpperCase() === 'BLOQUEADA' ? 'rgba(249,115,22,0.1)' : 
                    estadoCuenta?.toUpperCase() === 'CANCELADA' ? 'rgba(239,68,68,0.1)' : 'rgba(156,163,175,0.1)';

    return (
      <View style={styles.accountItem}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountNumber}>{numeroCuenta}</Text>
          <Text style={styles.accountType}>{tipoCuenta}</Text>
          <Text style={styles.accountUser}>Usuario: {idUsuario}</Text>
          <Text style={styles.accountCurrency}>Moneda: {moneda}</Text>
        </View>
        <View style={styles.accountBalance}>
          <Text style={styles.balanceValue}>
            {formatCurrency ? formatCurrency(saldo) : `Q${Number(saldo).toLocaleString('es-GT')}`}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: estadoBg }]}>
            <Text style={[styles.statusText, { color: estadoColor }]}>
              {estadoCuenta}
            </Text>
          </View>
        </View>
        {isAdmin && (
          <View style={styles.accountActions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditAccount(item)}>
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteAccount(item._id || item.id)}>
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Cuentas" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gestión de Cuentas</Text>
          <Text style={styles.headerSubtitle}>Crear, editar y administrar cuentas bancarias de los usuarios.</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsCreateModalOpen(true)}>
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
        <TouchableOpacity style={styles.filterButton} onPress={handleSearchByUserId}>
          <Text style={styles.filterButtonText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonSecondary]} onPress={handleClearFilter}>
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
            data={filterUsuarioId.trim() ? cuentas.filter(c => 
              (c.IdUsuario || c.idUsuario || c.usuarioId || c.userId) === filterUsuarioId.trim()
            ) : cuentas}
            renderItem={renderAccount}
            keyExtractor={(item) => item._id || item.id}
            scrollEnabled={false}
          />
        )}
      </View>
      </ScrollView>

      <Toast
        message={toast?.message}
        type={toast?.type}
        visible={toast?.visible}
        onHide={hideToast}
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

      <EditAccountModal
        isVisible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAccountToEdit(null);
        }}
        selected={accountToEdit}
        onSubmit={handleUpdateAccount}
        loading={loading}
      />

      <CreateAccount
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={() => {
          setIsCreateModalOpen(false);
          fetchCuentas();
          showToast('Cuenta creada correctamente', 'success');
        }}
      />
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
  accountCurrency: {
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
  accountActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  editButton: {
    borderColor: '#f59e0b',
    backgroundColor: 'transparent',
  },
  deleteButton: {
    borderColor: '#ef4444',
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#f59e0b',
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
