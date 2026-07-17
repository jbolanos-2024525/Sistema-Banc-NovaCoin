// src/features/accounts/screens/CreateAccount.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAdminAccountStore } from '../../adminAccount/store/adminAccountStore';

const CreateAccount = ({ isVisible, onClose, onConfirm }) => {
  const { createCuenta, loading } = useAdminAccountStore();
  const [formData, setFormData] = useState({
    IdUsuario: '',
    TipoCuenta: 'AHORRO',
    Moneda: 'GTQ',
    Saldo: '0',
    LimiteRetiroDiario: '5000',
  });

  useEffect(() => {
    if (isVisible) {
      setFormData({
        IdUsuario: '',
        TipoCuenta: 'AHORRO',
        Moneda: 'GTQ',
        Saldo: '0',
        LimiteRetiroDiario: '5000',
      });
    }
  }, [isVisible]);

  const handleCreate = async () => {
    if (!formData.IdUsuario) {
      Alert.alert('Error', 'El ID de usuario es requerido');
      return;
    }

    const result = await createCuenta({
      IdUsuario: formData.IdUsuario,
      TipoCuenta: formData.TipoCuenta,
      Moneda: formData.Moneda,
      Saldo: parseFloat(formData.Saldo) || 0,
      LimiteRetiroDiario: parseFloat(formData.LimiteRetiroDiario) || 5000,
    });

    if (result.success) {
      onClose();
      if (onConfirm) onConfirm();
    } else {
      Alert.alert('Error', result.error || 'No se pudo crear la cuenta');
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

          <Text style={styles.modalTitle}>Nueva Cuenta Bancaria</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>ID DEL USUARIO (UUID) *</Text>
          <TextInput
            style={styles.input}
            placeholder="ej: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            value={formData.IdUsuario}
            onChangeText={(text) => setFormData({ ...formData, IdUsuario: text })}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>TIPO DE CUENTA</Text>
          <View style={styles.typeButtons}>
            {['AHORRO', 'MONETARIA', 'EMPRESARIAL'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.typeButton, formData.TipoCuenta === tipo && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, TipoCuenta: tipo })}
              >
                <Text style={[styles.typeButtonText, formData.TipoCuenta === tipo && styles.typeButtonTextActive]}>
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>MONEDA</Text>
          <View style={styles.typeButtons}>
            {['GTQ', 'USD'].map((moneda) => (
              <TouchableOpacity
                key={moneda}
                style={[styles.typeButton, formData.Moneda === moneda && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, Moneda: moneda })}
              >
                <Text style={[styles.typeButtonText, formData.Moneda === moneda && styles.typeButtonTextActive]}>
                  {moneda}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>SALDO INICIAL</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.Saldo}
            onChangeText={(text) => setFormData({ ...formData, Saldo: text })}
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>LÍMITE RETIRO DIARIO</Text>
          <TextInput
            style={styles.input}
            placeholder="5000"
            value={formData.LimiteRetiroDiario}
            onChangeText={(text) => setFormData({ ...formData, LimiteRetiroDiario: text })}
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
          />
        </View>

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
                {loading ? 'Guardando...' : 'Crear Cuenta'}
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
    borderColor: '#c084fc',
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
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    color: '#f3f4f6',
    fontSize: 14,
    padding: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#c084fc',
    borderColor: '#c084fc',
  },
  typeButtonText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#0d1117',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
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
    backgroundColor: '#c084fc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#0d1117',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CreateAccount;
