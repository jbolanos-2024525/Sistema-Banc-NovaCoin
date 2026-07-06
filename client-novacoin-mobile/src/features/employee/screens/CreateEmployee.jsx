// src/features/employee/screens/CreateEmployee.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useEmployeeStore } from '../store/employeeStore';

const CreateEmployee = ({ navigation }) => {
  const { createEmployee, loading } = useEmployeeStore();
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    DPI: '',
    Correo: '',
    Telefono: '',
    Puesto: 'Asesor',
    Salario: '',
  });

  const handleCreate = async () => {
    if (!formData.Nombre || !formData.Apellido || !formData.DPI || !formData.Correo || !formData.Telefono || !formData.Puesto || !formData.Salario) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (formData.DPI.length !== 13) {
      Alert.alert('Error', 'El DPI debe tener 13 dígitos');
      return;
    }

    if (formData.Telefono.length !== 8) {
      Alert.alert('Error', 'El teléfono debe tener 8 dígitos');
      return;
    }

    const result = await createEmployee({
      Nombre: formData.Nombre,
      Apellido: formData.Apellido,
      DPI: formData.DPI.trim(),
      Correo: formData.Correo,
      Telefono: formData.Telefono,
      Puesto: formData.Puesto,
      Salario: parseFloat(formData.Salario) || 0,
      isActive: true,
      isVerified: true,
    });

    if (result.success) {
      Alert.alert('Éxito', 'Empleado creado correctamente');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error || 'No se pudo crear el empleado');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Empleado</Text>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Establece los parámetros requeridos para el perfil administrativo</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.rowGroup}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.Nombre}
              onChangeText={(text) => setFormData({ ...formData, Nombre: text })}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={formData.Apellido}
              onChangeText={(text) => setFormData({ ...formData, Apellido: text })}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>DPI</Text>
            <TextInput
              style={styles.input}
              placeholder="13 dígitos"
              value={formData.DPI}
              onChangeText={(text) => setFormData({ ...formData, DPI: text })}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={13}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              value={formData.Correo}
              onChangeText={(text) => setFormData({ ...formData, Correo: text })}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="8 dígitos"
              value={formData.Telefono}
              onChangeText={(text) => setFormData({ ...formData, Telefono: text })}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Salario</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={formData.Salario}
              onChangeText={(text) => setFormData({ ...formData, Salario: text })}
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Puesto</Text>
          <View style={styles.roleButtons}>
            {['Asesor', 'Cajero', 'Gerente', 'Administrador'].map((puesto) => (
              <TouchableOpacity
                key={puesto}
                style={[styles.roleButton, formData.Puesto === puesto && styles.roleButtonActive]}
                onPress={() => setFormData({ ...formData, Puesto: puesto })}
              >
                <Text style={[styles.roleButtonText, formData.Puesto === puesto && styles.roleButtonTextActive]}>
                  {puesto}
                </Text>
              </TouchableOpacity>
            ))}
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
              {loading ? 'Procesando...' : 'Guardar'}
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
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  subtitleContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    opacity: 0.85,
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
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    padding: 10,
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
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  roleButtonActive: {
    backgroundColor: '#b8860b',
    borderColor: '#b8860b',
  },
  roleButtonText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#fff',
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
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  cancelButtonText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#b8860b',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CreateEmployee;
