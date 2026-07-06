// src/features/accounts/screens/AccountDetail.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, Header } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useAccounts } from '../hooks/useAccounts';

const AccountDetail = ({ route, navigation }) => {
  const { accountId } = route.params;
  const { getAccountById, loading, error } = useAccounts();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadAccountDetail();
  }, [accountId]);

  const loadAccountDetail = useCallback(async () => {
    try {
      const accountData = await getAccountById(accountId);
      setAccount(accountData);
    } catch (err) {
      console.error('Error al cargar detalle de cuenta:', err);
    }
  }, [accountId, getAccountById]);

  const handleTransfer = () => {
    navigation.navigate('CreateTransaction', { accountId, accountNumber: account?.accountNumber });
  };

  if (loading && !account) {
    return <Loading />;
  }

  if (!account) {
    return (
      <Container padding="md">
        <Card elevation="md">
          <Text style={styles.errorText}>No se pudo cargar la cuenta</Text>
        </Card>
      </Container>
    );
  }

  return (
    <ScrollView>
      <Container padding="md">
        <Header
          title="Detalle de Cuenta"
          subtitle={`Cuenta ${account.accountNumber}`}
        />

        {error && (
          <Card elevation="sm" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Card elevation="lg" style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <MaterialIcons name="account-balance" size={48} color={theme.colors.primary.main} />
            <View style={[styles.statusBadge, { backgroundColor: account.status === 'active' ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
              <Text style={[styles.statusText, { color: account.status === 'active' ? theme.colors.success : theme.colors.error }]}>
                {account.status === 'active' ? 'Activa' : 'Inactiva'}
              </Text>
            </View>
          </View>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balance}>Q {account.balance.toFixed(2)}</Text>
        </Card>

        <Card elevation="md" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información de la Cuenta</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de Cuenta</Text>
            <Text style={styles.infoValue}>{account.accountNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo de Cuenta</Text>
            <Text style={styles.infoValue}>{account.accountType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={[styles.infoValue, { color: account.status === 'active' ? theme.colors.success : theme.colors.error }]}>
              {account.status === 'active' ? 'Activa' : 'Inactiva'}
            </Text>
          </View>
        </Card>

        <Card elevation="md" style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Acciones Rápidas</Text>
          
          <Button
            title="Realizar Transferencia"
            onPress={handleTransfer}
            icon={<MaterialIcons name="send" size={20} color={theme.colors.white} />}
            style={styles.actionButton}
          />

          <Button
            title="Ver Historial de Transacciones"
            onPress={() => navigation.navigate('TransactionsList', { accountId })}
            variant="outline"
            icon={<MaterialIcons name="history" size={20} color={theme.colors.primary.main} />}
            style={styles.actionButton}
          />
        </Card>
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
  balanceCard: {
    backgroundColor: theme.colors.primary.main,
    marginBottom: theme.spacing.lg,
  },
  balanceHeader: {
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
  balanceLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white + '80',
    marginBottom: theme.spacing.xs,
  },
  balance: {
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
  actionsCard: {
    marginBottom: theme.spacing.lg,
  },
  actionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default AccountDetail;
