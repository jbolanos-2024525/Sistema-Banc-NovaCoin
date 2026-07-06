// src/features/users/screens/CreateUser.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useUserManagementStore } from '../store/useUserManagementStore';

const CreateUser = ({ navigation }) => {
  const { createUser, loading } = useUserManagementStore();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleCreate = async () => {
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
      Alert.alert('Éxito', 'Usuario creado correctamente');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'No se pudo crear el usuario');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Usuario</Text>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Completa la información para registrar un nuevo usuario</Text>
      </View>

      <View style={styles.formContainer}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creando...' : 'Crear usuario'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16171d',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  closeButtonText: {
    color: '#9ca3af',
    fontSize: 18,
    lineHeight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  subtitleContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
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
});

export default CreateUser;
