// src/features/employee/screens/CreateEmployee.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useEmployeeStore } from '../store/employeeStore';
import Toast from '../../../shared/components/Toast';
import { useToast } from '../../../shared/hooks/useToast';

const CreateEmployee = ({ navigation }) => {
  const { createEmployee, loading } = useEmployeeStore();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    DPI: '',
    Correo: '',
    Telefono: '',
    Puesto: 'Asesor',
    Salario: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es obligatorio';
    if (!formData.Apellido.trim()) newErrors.Apellido = 'El apellido es obligatorio';
    
    if (!formData.DPI.trim()) {
      newErrors.DPI = 'El DPI es obligatorio';
    } else if (formData.DPI.length !== 13) {
      newErrors.DPI = 'Debe tener 13 dígitos';
    }
    
    if (!formData.Correo.trim()) {
      newErrors.Correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Correo)) {
      newErrors.Correo = 'Formato de correo inválido';
    }
    
    if (!formData.Telefono.trim()) {
      newErrors.Telefono = 'El teléfono es obligatorio';
    } else if (formData.Telefono.length !== 8) {
      newErrors.Telefono = 'Debe tener 8 dígitos';
    }
    
    if (!formData.Puesto) newErrors.Puesto = 'El puesto es obligatorio';
    if (!formData.Salario || parseFloat(formData.Salario) <= 0) {
      newErrors.Salario = 'El salario es obligatorio y debe ser mayor a cero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
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
      Rol: formData.Puesto,
      isActive: true,
      isVerified: true,
    });

    if (result.success) {
      showToast('Empleado creado correctamente', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } else {
      const errorMessage = result.error || 'No se pudo crear el empleado';
      if (errorMessage.includes('Ya existe un empleado') || errorMessage.includes('DPI o correo')) {
        showToast('Ya existe un empleado con ese DPI o correo', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
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
              style={[styles.input, errors.Nombre && styles.inputError]}
              placeholder="Nombre"
              value={formData.Nombre}
              onChangeText={(text) => {
                setFormData({ ...formData, Nombre: text });
                if (errors.Nombre) setErrors({ ...errors, Nombre: null });
              }}
              placeholderTextColor="#9ca3af"
            />
            {errors.Nombre && <Text style={styles.errorText}>{errors.Nombre}</Text>}
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={[styles.input, errors.Apellido && styles.inputError]}
              placeholder="Apellido"
              value={formData.Apellido}
              onChangeText={(text) => {
                setFormData({ ...formData, Apellido: text });
                if (errors.Apellido) setErrors({ ...errors, Apellido: null });
              }}
              placeholderTextColor="#9ca3af"
            />
            {errors.Apellido && <Text style={styles.errorText}>{errors.Apellido}</Text>}
          </View>
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>DPI</Text>
            <TextInput
              style={[styles.input, errors.DPI && styles.inputError]}
              placeholder="13 dígitos"
              value={formData.DPI}
              onChangeText={(text) => {
                setFormData({ ...formData, DPI: text });
                if (errors.DPI) setErrors({ ...errors, DPI: null });
              }}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={13}
            />
            {errors.DPI && <Text style={styles.errorText}>{errors.DPI}</Text>}
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={[styles.input, errors.Correo && styles.inputError]}
              placeholder="correo@ejemplo.com"
              value={formData.Correo}
              onChangeText={(text) => {
                setFormData({ ...formData, Correo: text });
                if (errors.Correo) setErrors({ ...errors, Correo: null });
              }}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.Correo && <Text style={styles.errorText}>{errors.Correo}</Text>}
          </View>
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, errors.Telefono && styles.inputError]}
              placeholder="8 dígitos"
              value={formData.Telefono}
              onChangeText={(text) => {
                setFormData({ ...formData, Telefono: text });
                if (errors.Telefono) setErrors({ ...errors, Telefono: null });
              }}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={8}
            />
            {errors.Telefono && <Text style={styles.errorText}>{errors.Telefono}</Text>}
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 16 }]}>
            <Text style={styles.label}>Salario</Text>
            <TextInput
              style={[styles.input, errors.Salario && styles.inputError]}
              placeholder="0.00"
              value={formData.Salario}
              onChangeText={(text) => {
                setFormData({ ...formData, Salario: text });
                if (errors.Salario) setErrors({ ...errors, Salario: null });
              }}
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
            {errors.Salario && <Text style={styles.errorText}>{errors.Salario}</Text>}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Puesto</Text>
          <View style={styles.roleButtons}>
            {['Asesor', 'Cajero', 'Gerente', 'Administrador'].map((puesto) => (
              <TouchableOpacity
                key={puesto}
                style={[styles.roleButton, formData.Puesto === puesto && styles.roleButtonActive]}
                onPress={() => {
                  setFormData({ ...formData, Puesto: puesto });
                  if (errors.Puesto) setErrors({ ...errors, Puesto: null });
                }}
              >
                <Text style={[styles.roleButtonText, formData.Puesto === puesto && styles.roleButtonTextActive]}>
                  {puesto}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.Puesto && <Text style={styles.errorText}>{errors.Puesto}</Text>}
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
      
      <Toast
        message={toast?.message}
        type={toast?.type}
        visible={toast?.visible}
        onHide={hideToast}
      />
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
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    padding: 10,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
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
