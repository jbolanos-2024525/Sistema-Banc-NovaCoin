// src/features/transactions/screens/TransactionsList.jsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, EmptyState } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useTransactions } from '../hooks/useTransactions';

const TransactionsList = ({ route, navigation }) => {
  const { accountId } = route.params || {};
  const { transactions, loading, error, fetchTransactions, fetchAccountTransactions } = useTransactions();

  useEffect(() => {
    if (accountId) {
      fetchAccountTransactions(accountId);
    } else {
      fetchTransactions();
    }
  }, [accountId]);

  const onRefresh = useCallback(async () => {
    if (accountId) {
      await fetchAccountTransactions(accountId);
    } else {
      await fetchTransactions();
    }
  }, [accountId, fetchTransactions, fetchAccountTransactions]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer':
        return 'swap-horiz';
      case 'deposit':
        return 'add-circle';
      case 'withdrawal':
        return 'remove-circle';
      default:
        return 'receipt';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'transfer':
        return theme.colors.info;
      case 'deposit':
        return theme.colors.success;
      case 'withdrawal':
        return theme.colors.warning;
      default:
        return theme.colors.gray[500];
    }
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'deposit' ? '+' : type === 'withdrawal' ? '-' : '';
    return `${prefix}Q ${amount.toFixed(2)}`;
  };

  const renderTransactionCard = ({ item }) => (
    <Card elevation="sm" style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getTransactionColor(item.type) + '20' }]}>
          <MaterialIcons name={getTransactionIcon(item.type)} size={24} color={getTransactionColor(item.type)} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{item.type === 'transfer' ? 'Transferencia' : item.type === 'deposit' ? 'Depósito' : 'Retiro'}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: item.type === 'deposit' ? theme.colors.success : item.type === 'withdrawal' ? theme.colors.warning : theme.colors.text.primary }]}>
          {formatAmount(item.amount, item.type)}
        </Text>
      </View>
      <View style={styles.transactionFooter}>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? theme.colors.success + '20' : theme.colors.warning + '20' }]}>
          <Text style={[styles.statusText, { color: item.status === 'completed' ? theme.colors.success : theme.colors.warning }]}>
            {item.status === 'completed' ? 'Completada' : 'Pendiente'}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <EmptyState
      message="No hay transacciones registradas"
      icon={<MaterialIcons name="receipt-long" size={64} color={theme.colors.gray[300]} />}
    />
  );

  if (loading && transactions.length === 0) {
    return <Loading />;
  }

  return (
    <Container padding="md">
      <View style={styles.header}>
        <Text style={styles.title}>{accountId ? 'Historial de Cuenta' : 'Historial de Transacciones'}</Text>
        {!accountId && (
          <Button
            title="Nueva Transacción"
            onPress={() => navigation.navigate('CreateTransaction')}
            variant="outline"
            size="small"
            icon={<MaterialIcons name="add" size={20} color={theme.colors.primary.main} />}
          />
        )}
      </View>

      {error && (
        <Card elevation="sm" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      <FlatList
        data={transactions}
        renderItem={renderTransactionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={transactions.length === 0 ? styles.emptyList : null}
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
  transactionCard: {
    marginBottom: theme.spacing.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  transactionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyList: {
    flex: 1,
  },
});

export default TransactionsList;
