// src/features/accounts/screens/AccountsList.jsx

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, EmptyState } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useAccounts } from '../hooks/useAccounts';

const AccountsList = ({ navigation }) => {
  const { accounts, loading, error, fetchAccounts } = useAccounts();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onRefresh = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  const renderAccountCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
      activeOpacity={0.7}
    >
      <Card elevation="md" style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountIconContainer}>
            <MaterialIcons name="account-balance" size={32} color={theme.colors.primary.main} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountNumber}>**** {item.accountNumber.slice(-4)}</Text>
            <Text style={styles.accountType}>{item.accountType}</Text>
          </View>
        </View>
        <View style={styles.accountBalanceContainer}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <Text style={styles.balance}>Q {item.balance.toFixed(2)}</Text>
        </View>
        <View style={styles.accountFooter}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
            <Text style={[styles.statusText, { color: item.status === 'active' ? theme.colors.success : theme.colors.error }]}>
              {item.status === 'active' ? 'Activa' : 'Inactiva'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.gray[400]} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <EmptyState
      message="No tiene cuentas registradas"
      icon={<MaterialIcons name="account-balance" size={64} color={theme.colors.gray[300]} />}
    />
  );

  if (loading && accounts.length === 0) {
    return <Loading />;
  }

  return (
    <Container padding="md">
      <View style={styles.header}>
        <Text style={styles.title}>Mis Cuentas</Text>
        <Button
          title="Nueva Cuenta"
          onPress={() => navigation.navigate('CreateAccount')}
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
        data={accounts}
        renderItem={renderAccountCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={accounts.length === 0 ? styles.emptyList : null}
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
  accountCard: {
    marginBottom: theme.spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  accountIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.main + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  accountType: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs / 2,
  },
  accountBalanceContainer: {
    marginBottom: theme.spacing.md,
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  balance: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyList: {
    flex: 1,
  },
});

export default AccountsList;
