// src/features/transactions/screens/CreateTransaction.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../../accounts/hooks/useAccounts';

const CreateTransaction = ({ route, navigation }) => {
  const { accountId, accountNumber } = route.params || {};
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { createTransfer, loading, error } = useTransactions();
  const { accounts, fetchAccounts } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState(accountId || '');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onSubmit = async (data) => {
    try {
      const transferData = {
        fromAccountId: selectedAccount,
        toAccountNumber: data.toAccountNumber,
        amount: parseFloat(data.amount),
        description: data.description,
      };

      const result = await createTransfer(transferData);
      if (result) {
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error al realizar transferencia:', err);
    }
  };

  return (
    <ScrollView>
      <Container padding="md">
        <Card elevation="lg">
          <Text style={styles.title}>Transferencia entre Cuentas</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Cuenta Origen"
            name="fromAccount"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Seleccione cuenta de origen"
            icon="account-balance"
            value={selectedAccount}
            onChangeText={setSelectedAccount}
            error={errors.fromAccount?.message}
          />

          <Input
            label="Número de Cuenta Destino"
            name="toAccountNumber"
            control={control}
            rules={{ 
              required: 'Este campo es requerido',
              pattern: { value: /^\d+$/, message: 'Solo números' }
            }}
            placeholder="Ingrese número de cuenta"
            icon="account-balance"
            keyboardType="numeric"
            error={errors.toAccountNumber?.message}
          />

          <Input
            label="Monto a Transferir"
            name="amount"
            control={control}
            rules={{ 
              required: 'Este campo es requerido',
              pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Monto inválido' },
              min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
            }}
            placeholder="0.00"
            icon="attach-money"
            keyboardType="decimal-pad"
            error={errors.amount?.message}
          />

          <Input
            label="Descripción (Opcional)"
            name="description"
            control={control}
            placeholder="Descripción de la transferencia"
            icon="description"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Realizar Transferencia"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            size="large"
            icon={<MaterialIcons name="send" size={20} color={theme.colors.white} />}
            style={styles.button}
          />
        </Card>

        <Card elevation="md" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información Importante</Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>Las transferencias se procesan en tiempo real</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>El monto mínimo de transferencia es Q 1.00</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>Verifique el número de cuenta destino antes de confirmar</Text>
          </View>
        </Card>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
  infoCard: {
    marginTop: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});

export default CreateTransaction;
