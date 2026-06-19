// src/features/loans/navigation/LoansStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import LoansList from '../screens/LoansList';
import LoanDetail from '../screens/LoanDetail';
import CreateLoanRequest from '../screens/CreateLoanRequest';

const Stack = createNativeStackNavigator();

const LoansStack = () => {
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
        name="LoansList"
        component={LoansList}
        options={{ title: 'Mis Préstamos' }}
      />
      <Stack.Screen
        name="LoanDetail"
        component={LoanDetail}
        options={{ title: 'Detalle de Préstamo' }}
      />
      <Stack.Screen
        name="CreateLoanRequest"
        component={CreateLoanRequest}
        options={{ title: 'Solicitar Préstamo' }}
      />
    </Stack.Navigator>
  );
};

export default LoansStack;
