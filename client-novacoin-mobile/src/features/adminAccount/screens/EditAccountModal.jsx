// src/features/adminAccount/screens/EditAccountModal.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EDIT_FIELDS = [
  { label: 'Tipo de Cuenta', name: 'TipoCuenta', options: ['AHORRO', 'MONETARIA', 'EMPRESARIAL'] },
  { label: 'Moneda', name: 'Moneda', options: ['GTQ', 'USD'] },
  { label: 'Límite Retiro Diario', name: 'LimiteRetiroDiario', type: 'number', placeholder: '5000' },
  { label: 'Estado Cuenta', name: 'EstadoCuenta', options: ['ACTIVA', 'BLOQUEADA', 'CANCELADA'] },
];

const EditAccountModal = ({ isVisible, onClose, selected, onSubmit, loading }) => {
  const [form, setForm] = useState({
    TipoCuenta: 'AHORRO',
    Moneda: 'GTQ',
    LimiteRetiroDiario: 5000,
    EstadoCuenta: 'ACTIVA',
  });

  useEffect(() => {
    if (selected) {
      setForm({
        TipoCuenta: selected.TipoCuenta || selected.tipoCuenta || 'AHORRO',
        Moneda: selected.Moneda || selected.moneda || 'GTQ',
        LimiteRetiroDiario: selected.LimiteRetiroDiario || selected.limiteRetiroDiario || 5000,
        EstadoCuenta: selected.EstadoCuenta || selected.estadoCuenta || 'ACTIVA',
      });
    }
  }, [selected, isVisible]);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: name === 'LimiteRetiroDiario' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    console.log('Enviando datos de edición:', form);
    console.log('Cuenta seleccionada:', selected);
    onSubmit(form);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Cuenta</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {selected && (
            <View style={styles.accountInfo}>
              <Text style={styles.infoLabel}>
                <Text style={styles.infoHighlight}>N°:</Text> {selected.NumeroCuenta || selected.numeroCuenta}
              </Text>
              <Text style={styles.infoLabel}>
                <Text style={styles.infoHighlight}>Usuario:</Text> {selected.IdUsuario || selected.idUsuario}
              </Text>
            </View>
          )}

          <ScrollView style={styles.formContainer}>
            {EDIT_FIELDS.map(({ label, name, type, placeholder, options }) => (
              <View key={name} style={styles.fieldGroup}>
                <Text style={styles.label}>{label}</Text>
                {options ? (
                  <View style={styles.optionsContainer}>
                    {options.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.optionButton, form[name] === opt && styles.optionButtonActive]}
                        onPress={() => handleChange(name, opt)}
                      >
                        <Text style={[styles.optionText, form[name] === opt && styles.optionTextActive]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={form[name]?.toString() || ''}
                    onChangeText={(text) => handleChange(name, text)}
                    placeholder={placeholder}
                    placeholderTextColor="#6b7280"
                    keyboardType={type === 'number' ? 'decimal-pad' : 'default'}
                  />
                )}
              </View>
            ))}
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
                {loading ? 'Guardando...' : 'Actualizar'}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  accountInfo: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
  infoHighlight: {
    color: '#00f2fe',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    color: '#f3f4f6',
    fontSize: 14,
    padding: 12,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    color: '#0d1117',
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
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#00f2fe',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#1f2937',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#0d1117',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default EditAccountModal;
