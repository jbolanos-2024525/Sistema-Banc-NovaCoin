// src/features/transactions/screens/CreateTransactionModal.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';

const CreateTransactionModal = ({ isVisible, onClose, onConfirm, onSave, onSubmit }) => {
  const [tipoTransaccion, setTipoTransaccion] = useState('TRANSFERENCIA');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('GTQ');
  const [descripcion, setDescripcion] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = () => {
    setLocalError('');

    if (tipoTransaccion === 'TRANSFERENCIA' && !cuentaDestino.trim()) {
      setLocalError('El UUID de la cuenta destino es obligatorio.');
      return;
    }

    if (parseFloat(monto) <= 0 || !monto) {
      setLocalError('El monto debe ser mayor a cero.');
      return;
    }

    const dto = {
      TipoTransaccion: tipoTransaccion,
      Monto: parseFloat(monto),
      Moneda: moneda,
      Descripcion: descripcion,
      CuentaDestino: tipoTransaccion === 'TRANSFERENCIA' ? cuentaDestino.trim() : null,
      CuentaOrigen: null
    };

    const handleSaveAction = onConfirm || onSave || onSubmit;

    if (handleSaveAction && typeof handleSaveAction === 'function') {
      handleSaveAction(dto);
    } else {
      console.error("No se detectó ninguna función de envío válida pasada desde la vista principal.");
      setLocalError("Error interno: No se pudo enlazar la acción de guardado.");
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

          <Text style={styles.modalTitle}>Nueva Operación</Text>

          {localError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{localError}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Tipo de Transacción</Text>
                <View style={styles.typeButtons}>
                  {['TRANSFERENCIA', 'DEPOSITO', 'RETIRO'].map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[styles.typeButton, tipoTransaccion === tipo && styles.typeButtonActive]}
                      onPress={() => setTipoTransaccion(tipo)}
                    >
                      <Text style={[styles.typeButtonText, tipoTransaccion === tipo && styles.typeButtonTextActive]}>
                        {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {tipoTransaccion === 'TRANSFERENCIA' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>UUID Cuenta Destino</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="00000000-0000-0000-0000-000000000002"
                    value={cuentaDestino}
                    onChangeText={setCuentaDestino}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                  />
                </View>
              )}

              <View style={styles.rowGroup}>
                <View style={[styles.fieldGroup, { flex: 2 }]}>
                  <Text style={styles.label}>Monto</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={monto}
                    onChangeText={setMonto}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={[styles.fieldGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>Moneda</Text>
                  <View style={styles.typeButtons}>
                    {['GTQ', 'USD'].map((monedaOption) => (
                      <TouchableOpacity
                        key={monedaOption}
                        style={[styles.typeButton, moneda === monedaOption && styles.typeButtonActive]}
                        onPress={() => setMoneda(monedaOption)}
                      >
                        <Text style={[styles.typeButtonText, moneda === monedaOption && styles.typeButtonTextActive]}>
                          {monedaOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Descripción / Concepto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Pago de servicios locales"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
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
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
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
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
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
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  typeButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeButtonText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#030712',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
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
  confirmButton: {
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CreateTransactionModal;
