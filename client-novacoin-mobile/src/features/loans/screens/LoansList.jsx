// src/features/loans/screens/LoansList.jsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, EmptyState } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useLoans } from '../hooks/useLoans';

const LoansList = ({ navigation }) => {
  const { loans, loading, error, fetchMyLoans } = useLoans();

  useEffect(() => {
    fetchMyLoans();
  }, [fetchMyLoans]);

  const onRefresh = useCallback(async () => {
    await fetchMyLoans();
  }, [fetchMyLoans]);

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

  const renderLoanCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('LoanDetail', { loanId: item.id })}
      activeOpacity={0.7}
    >
      <Card elevation="md" style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary.main + '10' }]}>
            <MaterialIcons name="account-balance-wallet" size={32} color={theme.colors.primary.main} />
          </View>
          <View style={styles.loanInfo}>
            <Text style={styles.loanAmount}>Q {item.amount.toFixed(2)}</Text>
            <Text style={styles.loanTerm}>{item.term} meses</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        <View style={styles.loanDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tasa de Interés</Text>
            <Text style={styles.detailValue}>{item.interestRate}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Cuota Mensual</Text>
            <Text style={styles.detailValue}>Q {item.monthlyPayment.toFixed(2)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Saldo Restante</Text>
            <Text style={styles.detailValue}>Q {item.remainingBalance.toFixed(2)}</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray[400]} style={styles.chevron} />
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <EmptyState
      message="No tiene préstamos registrados"
      icon={<MaterialIcons name="account-balance-wallet" size={64} color={theme.colors.gray[300]} />}
    />
  );

  if (loading && loans.length === 0) {
    return <Loading />;
  }

  return (
    <Container padding="md">
      <View style={styles.header}>
        <Text style={styles.title}>Mis Préstamos</Text>
        <Button
          title="Solicitar Préstamo"
          onPress={() => navigation.navigate('CreateLoanRequest')}
          variant="outline"
          size="small"
          icon={<MaterialIcons name="add" size={20} color={theme.colors.primary.main} />}
        />
      </View>

      {error && (
        <Card elevation="sm" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <FlatList
        data={loans}
        renderItem={renderLoanCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={loans.length === 0 ? styles.emptyList : null}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
  loanCard: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  loanInfo: {
    flex: 1,
  },
  loanAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  loanTerm: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
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
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs / 2,
  },
  chevron: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    marginTop: -12,
  },
  emptyList: {
    flex: 1,
  },
});

export default LoansList;
