// src/features/loans/screens/CreateLoanModal.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';

const CreateLoanModal = ({ isVisible, onClose, onConfirm, loanToEdit = null, isAdmin = false }) => {
  const isEditing = !!loanToEdit;

  const [monto, setMonto] = useState('');
  const [plazo, setPlazo] = useState('12');
  const [proposito, setProposito] = useState('');
  const [tipoPrestamo, setTipoPrestamo] = useState('PERSONAL');
  const [cliente, setCliente] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (loanToEdit) {
      setMonto(loanToEdit.monto?.toString() || '');
      setPlazo(loanToEdit.plazoMeses?.toString() || '12');
      setProposito(loanToEdit.proposito || '');
      setTipoPrestamo(loanToEdit.tipoPrestamo || 'PERSONAL');
      setCliente(loanToEdit.cliente || '');
    } else {
      setMonto('');
      setPlazo('12');
      setProposito('');
      setTipoPrestamo('PERSONAL');
      setCliente('');
    }
  }, [loanToEdit]);

  const tasaAnual = (loanToEdit?.tasaInteres ?? 15) / 100;
  const tasaMensual = tasaAnual / 12;
  const cuota = monto && plazo
    ? (parseFloat(monto) * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -parseInt(plazo)))
    : 0;

  const handleSubmit = () => {
    setLocalError('');

    if (!monto || parseFloat(monto) <= 0) {
      setLocalError('El monto debe ser mayor a cero.');
      return;
    }
    if (!proposito.trim()) {
      setLocalError('El propósito del préstamo es obligatorio.');
      return;
    }
    if (isAdmin && !cliente.trim()) {
      setLocalError('El ID del cliente es obligatorio para administradores.');
      return;
    }

    if (isEditing) {
      // Al editar como admin, enviar todos los campos permitidos
      if (isAdmin) {
        const dto = {
          tipoPrestamo,
          monto: parseFloat(monto),
          plazoMeses: parseInt(plazo),
          proposito: proposito.trim(),
          tasaInteres: 15,
        };
        if (onConfirm && typeof onConfirm === 'function') onConfirm(dto);
      } else {
        // Al editar como cliente normal, solo enviar propósito
        const dto = {
          proposito: proposito.trim(),
        };
        if (onConfirm && typeof onConfirm === 'function') onConfirm(dto);
      }
    } else {
      // Al crear, enviar todos los campos
      const dto = {
        tipoPrestamo,
        monto: parseFloat(monto),
        plazoMeses: parseInt(plazo),
        proposito: proposito.trim(),
      };
      if (isAdmin && cliente.trim()) {
        dto.cliente = cliente.trim();
      }
      dto.tasaInteres = 15;
      if (onConfirm && typeof onConfirm === 'function') onConfirm(dto);
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
        <View style={[styles.modalContainer, { borderColor: isEditing ? '#f59e0b' : '#00f2fe' }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>
            {isEditing ? 'Editar Préstamo' : 'Solicitar Préstamo'}
          </Text>

          {localError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{localError}</Text>
            </View>
          ) : null}

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              {!isEditing || isAdmin ? (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Tipo de Préstamo</Text>
                    <View style={styles.typeButtons}>
                      {['PERSONAL', 'HIPOTECARIO', 'VEHICULAR'].map((tipo) => (
                        <TouchableOpacity
                          key={tipo}
                          style={[styles.typeButton, tipoPrestamo === tipo && styles.typeButtonActive]}
                          onPress={() => setTipoPrestamo(tipo)}
                        >
                          <Text style={[styles.typeButtonText, tipoPrestamo === tipo && styles.typeButtonTextActive]}>
                            {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Monto (GTQ)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      value={monto}
                      onChangeText={setMonto}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Plazo</Text>
                    <View style={styles.typeButtons}>
                      {['6', '12', '24', '36', '48', '60'].map((meses) => (
                        <TouchableOpacity
                          key={meses}
                          style={[styles.typeButton, plazo === meses && styles.typeButtonActive]}
                          onPress={() => setPlazo(meses)}
                        >
                          <Text style={[styles.typeButtonText, plazo === meses && styles.typeButtonTextActive]}>
                            {meses} meses
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Propósito del Préstamo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Compra de vehículo, negocio, estudios..."
                  value={proposito}
                  onChangeText={setProposito}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {!isEditing && isAdmin && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>ID del Cliente</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ID del usuario cliente"
                    value={cliente}
                    onChangeText={setCliente}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}

              {monto && parseFloat(monto) > 0 ? (
                <View style={[styles.estimateContainer, isEditing && styles.estimateContainerEdit]}>
                  <Text style={styles.estimateLabel}>ESTIMADO MENSUAL</Text>
                  <Text style={[styles.estimateAmount, isEditing && styles.estimateAmountEdit]}>
                    Q {cuota.toFixed(2)}
                  </Text>
                  <Text style={styles.estimateDetails}>
                    Tasa anual: {loanToEdit?.tasaInteres ?? 15}% · {plazo} cuotas
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, isEditing && styles.confirmButtonEdit]}
              onPress={handleSubmit}
            >
              <Text style={styles.confirmButtonText}>
                {isEditing ? 'Guardar cambios' : 'Solicitar'}
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
    borderColor: '#00f2fe',
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
    padding: 28,
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
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
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
    flexWrap: 'wrap',
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
    backgroundColor: '#00f2fe',
    borderColor: '#00f2fe',
  },
  typeButtonText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#050c18',
  },
  estimateContainer: {
    backgroundColor: 'rgba(0, 242, 254, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.2)',
    borderRadius: 8,
    padding: 14,
  },
  estimateContainerEdit: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  estimateLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  estimateAmount: {
    color: '#00f2fe',
    fontSize: 24,
    fontWeight: '700',
  },
  estimateAmountEdit: {
    color: '#fbbf24',
  },
  estimateDetails: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: '#00f2fe',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonEdit: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  confirmButtonText: {
    color: '#050c18',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CreateLoanModal;
