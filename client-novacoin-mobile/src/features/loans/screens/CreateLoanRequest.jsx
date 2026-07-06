// src/features/loans/screens/CreateLoanRequest.jsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { useLoans } from '../hooks/useLoans';

const CreateLoanRequest = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const { applyForLoan, loading, error, calculateLoanQuote } = useLoans();
  const [quote, setQuote] = useState(null);

  const amount = watch('amount');
  const term = watch('term');

  const handleCalculateQuote = async () => {
    if (amount && term) {
      try {
        const quoteData = await calculateLoanQuote({
          amount: parseFloat(amount),
          term: parseInt(term),
        });
        setQuote(quoteData);
      } catch (err) {
        console.error('Error al calcular cotización:', err);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const loanData = {
        amount: parseFloat(data.amount),
        term: parseInt(data.term),
        purpose: data.purpose,
        description: data.description,
      };

      const result = await applyForLoan(loanData);
      if (result) {
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error al solicitar préstamo:', err);
    }
  };

  return (
    <ScrollView>
      <Container padding="md">
        <Card elevation="lg">
          <Text style={styles.title}>Solicitar Préstamo</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Monto Solicitado"
            name="amount"
            control={control}
            rules={{ 
              required: 'Este campo es requerido',
              pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Monto inválido' },
              min: { value: 1000, message: 'El monto mínimo es Q 1,000.00' }
            }}
            placeholder="0.00"
            icon="attach-money"
            keyboardType="decimal-pad"
            error={errors.amount?.message}
          />

          <Input
            label="Plazo (meses)"
            name="term"
            control={control}
            rules={{ 
              required: 'Este campo es requerido',
              pattern: { value: /^\d+$/, message: 'Solo números' },
              min: { value: 6, message: 'El plazo mínimo es 6 meses' },
              max: { value: 60, message: 'El plazo máximo es 60 meses' }
            }}
            placeholder="6 - 60 meses"
            icon="schedule"
            keyboardType="numeric"
            error={errors.term?.message}
          />

          <Input
            label="Propósito del Préstamo"
            name="purpose"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ej: Educación, Vivienda, Negocio"
            icon="flag"
            error={errors.purpose?.message}
          />

          <Input
            label="Descripción (Opcional)"
            name="description"
            control={control}
            placeholder="Detalles adicionales sobre el préstamo"
            icon="description"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Calcular Cuota"
            onPress={handleCalculateQuote}
            variant="outline"
            icon={<MaterialIcons name="calculate" size={20} color={theme.colors.primary.main} />}
            style={styles.quoteButton}
          />

          {quote && (
            <Card elevation="sm" style={styles.quoteCard}>
              <Text style={styles.quoteTitle}>Cotización Estimada</Text>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Tasa de Interés</Text>
                <Text style={styles.quoteValue}>{quote.interestRate}%</Text>
              </View>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Cuota Mensual</Text>
                <Text style={styles.quoteValue}>Q {quote.monthlyPayment.toFixed(2)}</Text>
              </View>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Total a Pagar</Text>
                <Text style={styles.quoteValue}>Q {quote.totalPayment.toFixed(2)}</Text>
              </View>
            </Card>
          )}

          <Button
            title="Enviar Solicitud"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            size="large"
            icon={<MaterialIcons name="send" size={20} color={theme.colors.white} />}
            style={styles.submitButton}
          />
        </Card>

        <Card elevation="md" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Requisitos</Text>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.infoText}>Ser cliente activo por mínimo 6 meses</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.infoText}>Tener ingresos mensuales comprobables</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
            <Text style={styles.infoText}>Historial crediticio favorable</Text>
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
  quoteButton: {
    marginTop: theme.spacing.md,
  },
  quoteCard: {
    backgroundColor: theme.colors.primary.main + '10',
    marginTop: theme.spacing.md,
  },
  quoteTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.md,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  quoteLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  quoteValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  submitButton: {
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

export default CreateLoanRequest;
