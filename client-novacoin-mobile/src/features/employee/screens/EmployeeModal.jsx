// src/features/employee/screens/EmployeeModal.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PUESTO_OPTIONS = ['Asesor', 'Cajero', 'Gerente', 'Administrador'];

const EmployeeModal = ({ isVisible, onClose, onSave, loading, employee }) => {
  const isEditing = !!employee;
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    DPI: '',
    Correo: '',
    Telefono: '',
    Puesto: 'Asesor',
    Salario: '',
    Rol: 'Asesor'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isVisible) {
      if (employee) {
        setFormData({
          Nombre: employee.Nombre || employee.nombre || '',
          Apellido: employee.Apellido || employee.apellido || '',
          DPI: employee.DPI || employee.dpi || '',
          Correo: employee.Correo || employee.correo || '',
          Telefono: employee.Telefono || employee.telefono || '',
          Puesto: employee.Puesto || employee.puesto || 'Asesor',
          Salario: employee.Salario?.toString() || employee.salario?.toString() || '',
          Rol: employee.Rol || employee.rol || 'Asesor'
        });
      } else {
        setFormData({
          Nombre: '',
          Apellido: '',
          DPI: '',
          Correo: '',
          Telefono: '',
          Puesto: 'Asesor',
          Salario: '',
          Rol: 'Asesor'
        });
      }
      setErrors({});
    }
  }, [isVisible, employee]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es obligatorio';
    if (!formData.Apellido.trim()) newErrors.Apellido = 'El apellido es obligatorio';
    if (!formData.DPI.trim()) {
      newErrors.DPI = 'El DPI es obligatorio';
    } else if (formData.DPI.length !== 13) {
      newErrors.DPI = 'Debe tener 13 dígitos';
    }
    if (!formData.Correo.trim()) newErrors.Correo = 'El correo es obligatorio';
    if (!formData.Telefono.trim()) {
      newErrors.Telefono = 'El teléfono es obligatorio';
    } else if (formData.Telefono.length !== 8) {
      newErrors.Telefono = 'Debe tener 8 dígitos';
    }
    if (!formData.Puesto) newErrors.Puesto = 'El puesto es obligatorio';
    if (!formData.Salario || parseFloat(formData.Salario) <= 0) newErrors.Salario = 'El salario es obligatorio y debe ser mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const payload = {
        ...formData,
        DPI: formData.DPI.trim(),
        Correo: formData.Correo.trim(),
        Salario: parseFloat(formData.Salario) || 0
      };

      // Asegurar que el Salario sea un número válido
      if (isNaN(payload.Salario) || payload.Salario <= 0) {
        setErrors({ Salario: 'El salario debe ser un número mayor a 0' });
        return;
      }

      if (!employee) {
        payload.isActive = true;
        payload.isVerified = true;
      }

      console.log('Submitting payload:', payload);
      onSave(payload);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { borderColor: isEditing ? '#f59e0b' : '#00f2fe' }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
          </Text>

          <ScrollView style={styles.formContainer}>
            <View style={styles.rowGroup}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={[styles.input, errors.Nombre && styles.inputError]}
                  value={formData.Nombre}
                  onChangeText={(text) => handleChange('Nombre', text)}
                  placeholder="Nombre"
                  placeholderTextColor="#6b7280"
                />
                {errors.Nombre && <Text style={styles.errorText}>{errors.Nombre}</Text>}
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                  style={[styles.input, errors.Apellido && styles.inputError]}
                  value={formData.Apellido}
                  onChangeText={(text) => handleChange('Apellido', text)}
                  placeholder="Apellido"
                  placeholderTextColor="#6b7280"
                />
                {errors.Apellido && <Text style={styles.errorText}>{errors.Apellido}</Text>}
              </View>
            </View>

            <View style={styles.rowGroup}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>DPI</Text>
                <TextInput
                  style={[styles.input, errors.DPI && styles.inputError]}
                  value={formData.DPI}
                  onChangeText={(text) => handleChange('DPI', text)}
                  placeholder="13 dígitos"
                  keyboardType="numeric"
                  maxLength={13}
                  placeholderTextColor="#6b7280"
                />
                {errors.DPI && <Text style={styles.errorText}>{errors.DPI}</Text>}
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Correo</Text>
                <TextInput
                  style={[styles.input, errors.Correo && styles.inputError]}
                  value={formData.Correo}
                  onChangeText={(text) => handleChange('Correo', text)}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#6b7280"
                />
                {errors.Correo && <Text style={styles.errorText}>{errors.Correo}</Text>}
              </View>
            </View>

            <View style={styles.rowGroup}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Puesto</Text>
                <View style={styles.optionsContainer}>
                  {PUESTO_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionButton, formData.Puesto === opt && styles.optionButtonActive]}
                      onPress={() => handleChange('Puesto', opt)}
                    >
                      <Text style={[styles.optionText, formData.Puesto === opt && styles.optionTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.Puesto && <Text style={styles.errorText}>{errors.Puesto}</Text>}
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Salario</Text>
                <TextInput
                  style={[styles.input, errors.Salario && styles.inputError]}
                  value={formData.Salario}
                  onChangeText={(text) => handleChange('Salario', text)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#6b7280"
                />
                {errors.Salario && <Text style={styles.errorText}>{errors.Salario}</Text>}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={[styles.input, errors.Telefono && styles.inputError]}
                value={formData.Telefono}
                onChangeText={(text) => handleChange('Telefono', text)}
                placeholder="8 dígitos"
                keyboardType="numeric"
                maxLength={8}
                placeholderTextColor="#6b7280"
              />
              {errors.Telefono && <Text style={styles.errorText}>{errors.Telefono}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.optionsContainer}>
                {PUESTO_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionButton, formData.Rol === opt && styles.optionButtonActive]}
                    onPress={() => handleChange('Rol', opt)}
                  >
                    <Text style={[styles.optionText, formData.Rol === opt && styles.optionTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Procesando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderRadius: 12,
    padding: 28,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
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
  formContainer: {
    marginBottom: 20,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#9ca3af',
    fontSize: 13,
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
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#00f2fe',
    borderColor: '#00f2fe',
  },
  optionText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#050c18',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#00f2fe',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#1f2937',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#050c18',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmployeeModal;
