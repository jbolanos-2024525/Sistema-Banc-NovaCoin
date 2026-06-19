// src/features/loans/screens/LoanDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, Header } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useLoans } from '../hooks/useLoans';

const LoanDetail = ({ route, navigation }) => {
  const { loanId } = route.params;
  const { getLoanById, makePayment, loading, error } = useLoans();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    loadLoanDetail();
  }, [loanId]);

  const loadLoanDetail = useCallback(async () => {
    try {
      const loanData = await getLoanById(loanId);
      setLoan(loanData);
    } catch (err) {
      console.error('Error al cargar detalle de préstamo:', err);
    }
  }, [loanId, getLoanById]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      case 'paid':
        return theme.colors.info;
      default:
        return theme.colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      case 'paid':
        return 'Pagado';
      default:
        return status;
    }
  };

  const renderPaymentItem = ({ item, index }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentNumber}>
        <Text style={styles.paymentNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentDate}>{new Date(item.date).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
        <Text style={styles.paymentAmount}>Q {item.amount.toFixed(2)}</Text>
      </View>
      <View style={[styles.paymentStatus, { backgroundColor: item.paid ? theme.colors.success + '20' : theme.colors.gray[100] }]}>
        <Text style={[styles.paymentStatusText, { color: item.paid ? theme.colors.success : theme.colors.gray[500] }]}>
          {item.paid ? 'Pagado' : 'Pendiente'}
        </Text>
      </View>
    </View>
  );

  if (loading && !loan) {
    return <Loading />;
  }

  if (!loan) {
    return (
      <Container padding="md">
        <Card elevation="md">
          <Text style={styles.errorText}>No se pudo cargar el préstamo</Text>
        </Card>
      </Container>
    );
  }

  return (
    <ScrollView>
      <Container padding="md">
        <Header
          title="Detalle de Préstamo"
          subtitle={`Préstamo #${loan.id}`}
        />

        {error && (
          <Card elevation="sm" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Card elevation="lg" style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <MaterialIcons name="account-balance-wallet" size={48} color={theme.colors.white} />
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(loan.status) + '30' }]}>
              <Text style={[styles.statusText, { color: theme.colors.white }]}>
                {getStatusText(loan.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.amountLabel}>Monto del Préstamo</Text>
          <Text style={styles.amount}>Q {loan.amount.toFixed(2)}</Text>
        </Card>

        <Card elevation="md" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información del Préstamo</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tasa de Interés</Text>
            <Text style={styles.infoValue}>{loan.interestRate}% anual</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plazo</Text>
            <Text style={styles.infoValue}>{loan.term} meses</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cuota Mensual</Text>
            <Text style={styles.infoValue}>Q {loan.monthlyPayment.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Saldo Restante</Text>
            <Text style={styles.infoValue}>Q {loan.remainingBalance.toFixed(2)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha Inicio</Text>
            <Text style={styles.infoValue}>{new Date(loan.startDate).toLocaleDateString('es-GT')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha Final</Text>
            <Text style={styles.infoValue}>{new Date(loan.endDate).toLocaleDateString('es-GT')}</Text>
          </View>
        </Card>

        <Card elevation="md" style={styles.paymentsCard}>
          <Text style={styles.paymentsTitle}>Cronograma de Pagos</Text>
          
          <FlatList
            data={loan.payments || []}
            renderItem={renderPaymentItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </Card>

        {loan.status === 'approved' && loan.remainingBalance > 0 && (
          <Button
            title="Realizar Pago"
            onPress={() => {}}
            icon={<MaterialIcons name="payment" size={20} color={theme.colors.white} />}
            style={styles.paymentButton}
          />
        )}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
  amountCard: {
    backgroundColor: theme.colors.primary.main,
    marginBottom: theme.spacing.lg,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  amountLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white + '80',
    marginBottom: theme.spacing.xs,
  },
  amount: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  paymentsCard: {
    marginBottom: theme.spacing.lg,
  },
  paymentsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  paymentNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary.main + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  paymentNumberText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  paymentAmount: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  paymentStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  paymentStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  paymentButton: {
    marginBottom: theme.spacing.lg,
  },
});

export default LoanDetail;
