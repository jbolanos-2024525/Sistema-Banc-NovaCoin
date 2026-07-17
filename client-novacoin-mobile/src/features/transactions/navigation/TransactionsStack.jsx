// src/features/transactions/navigation/TransactionsStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import TransactionsScreen from '../screens/TransactionsScreen';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const Stack = createNativeStackNavigator();

const TransactionsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
