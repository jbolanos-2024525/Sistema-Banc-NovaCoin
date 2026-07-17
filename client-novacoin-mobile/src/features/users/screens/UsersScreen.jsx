// src/features/users/screens/UsersScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useUserManagementStore } from '../store/useUserManagementStore';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';
import CustomHeader from '../../../shared/components/layout/CustomHeader';
import CreateUser from './CreateUser';

const UsersScreen = ({ navigation }) => {
  const { users, loading, fetchUsers } = useUserManagementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setConfirmConfig({
      title: 'Actualizar Usuario',
      message: `¿Estás seguro de actualizar al usuario ${user.name || user.username}? Esta acción modificará la información del usuario.`,
      confirmText: 'Sí, Actualizar',
      confirmColor: '#f59e0b',
      onConfirm: () => {
        setConfirmConfig(null);
        setEmployeeToEdit(user);
        setIsModalOpen(true);
      },
      onClose: () => setConfirmConfig(null)
    });
  };

  const renderUser = ({ item }) => (
    <View style={styles.userRow}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || '—'} {item.surname || ''}</Text>
        <Text style={styles.userUsername}>{item.username || '—'}</Text>
        <Text style={styles.userEmail}>{item.email || '—'}</Text>
        <Text style={styles.userPhone}>{item.phone || '—'}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
        <Text style={[styles.roleText, { color: '#3b82f6' }]}>{item.role || 'USER'}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <MaterialIcons name="edit" size={16} color="#f59e0b" />
          <Text style={styles.editButtonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Usuarios" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Usuarios</Text>
          <Text style={styles.headerSubtitle}>
            Administra los usuarios registrados en NovaCoin.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#3b82f6' }]}
          onPress={() => setIsModalOpen(true)}
        >
          <MaterialIcons name="add" size={20} color="#050c18" />
          <Text style={styles.addButtonText}>Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Tabla */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          {['Nombre', 'Username', 'Email', 'Rol'].map((h) => (
            <Text key={h} style={styles.tableHeaderText}>{h}</Text>
          ))}
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No hay usuarios registrados</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item._id || item.id}
            scrollEnabled={false}
          />
        )}
      </View>

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

      {/* Modal de crear usuario */}
      <CreateUser
        isVisible={isModalOpen}
        user={employeeToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onConfirm={() => {
          setIsModalOpen(false);
          setEmployeeToEdit(null);
          fetchUsers();
          showToast(employeeToEdit ? 'Rol actualizado correctamente' : 'Usuario creado correctamente', 'success');
        }}
      />

      </ScrollView>

      <Toast
        message={toast?.message}
        type={toast?.type}
        visible={toast?.visible}
        onHide={hideToast}
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
  },
  header: {
    padding: 24,
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
    color: '#050c18',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#050c18',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    margin: 24,
    marginTop: 0,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    padding: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  userRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    padding: 14,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  userUsername: {
    color: '#3b82f6',
    fontSize: 13,
    marginTop: 2,
  },
  userEmail: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  userPhone: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editButtonText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default UsersScreen;
