// src/features/users/screens/CreateUser.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useUserManagementStore } from '../store/useUserManagementStore';

const CreateUser = ({ isVisible, onClose, onConfirm, user }) => {
  const { createUser, updateUserRole, loading } = useUserManagementStore();
  const isEditing = !!user;
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER_ROLE',
  });

  useEffect(() => {
    if (isVisible) {
      if (isEditing && user) {
        setFormData({
          role: user.role || 'USER_ROLE',
        });
      } else {
        setFormData({
          name: '',
          surname: '',
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'USER_ROLE',
        });
      }
    }
  }, [isVisible, isEditing, user]);

  const handleCreate = async () => {
    if (isEditing) {
      // Modo edición: solo actualizar rol
      const result = await updateUserRole(user._id || user.id, formData.role);
      if (result.success) {
        onClose();
        if (onConfirm) onConfirm();
      } else {
        Alert.alert('Error', result.error || 'No se pudo actualizar el rol');
      }
      return;
    }

    // Modo creación: validar todos los campos
    if (!formData.name || !formData.surname || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (formData.username.length < 3) {
      Alert.alert('Error', 'El username debe tener mínimo 3 caracteres');
      return;
    }

    if (formData.phone.length !== 8) {
      Alert.alert('Error', 'El teléfono debe tener 8 dígitos');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Formato de email inválido');
      return;
    }

    const result = await createUser({
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'USER_ROLE',
    });

    if (result.success) {
      onClose();
      if (onConfirm) onConfirm();
    } else {
      Alert.alert('Error', result.error || 'No se pudo crear el usuario');
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{isEditing ? 'Actualizar Rol' : 'Nuevo Usuario'}</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              {isEditing ? (
                // Modo edición: solo mostrar campo de rol
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Rol del Usuario</Text>
                  <View style={styles.roleButtons}>
                    {['USER_ROLE', 'ADMIN_ROLE'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[styles.roleButton, formData.role === role && styles.roleButtonActive]}
                        onPress={() => setFormData({ ...formData, role })}
                      >
                        <Text style={[styles.roleButtonText, formData.role === role && styles.roleButtonTextActive]}>
                          {role.replace('_ROLE', '')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                // Modo creación: mostrar todos los campos
                <>
                <View style={styles.rowGroup}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Apellido"
                      value={formData.surname}
                      onChangeText={(text) => setFormData({ ...formData, surname: text })}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <View style={styles.rowGroup}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Nombre de Usuario</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      value={formData.username}
                      onChangeText={(text) => setFormData({ ...formData, username: text })}
                      placeholderTextColor="#9ca3af"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="8 dígitos"
                      value={formData.phone}
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      maxLength={8}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.rowGroup}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirma la contraseña"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                      placeholderTextColor="#9ca3af"
                      secureTextEntry
                    />
                  </View>
                </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar Rol' : 'Crear usuario')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 12,
    width: '90%',
    maxWidth: 480,
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1000,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  formContainer: {
    gap: 16,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  roleButtonActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  roleButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#050c18',
  },
});

export default CreateUser;
