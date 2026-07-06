// src/features/transactions/navigation/TransactionsStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import TransactionsScreen from '../screens/TransactionsScreen';

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
        component={TransactionsScreen}
        options={{ title: 'Transacciones' }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
