// src/features/transactions/navigation/TransactionsStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import TransactionsList from '../screens/TransactionsList';
import CreateTransaction from '../screens/CreateTransaction';

const Stack = createNativeStackNavigator();

const TransactionsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
      }}
    >
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsList}
        options={{ title: 'Transacciones' }}
      />
      <Stack.Screen
        name="CreateTransaction"
        component={CreateTransaction}
        options={{ title: 'Nueva Transacción' }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
