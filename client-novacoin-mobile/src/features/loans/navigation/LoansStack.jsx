// src/features/loans/navigation/LoansStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import LoanScreen from '../../loan/screens/LoanScreen';

const Stack = createNativeStackNavigator();

const LoansStack = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

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
        component={LoanScreen}
        options={{ title: isAdmin ? 'Préstamos' : 'Mis Préstamos' }}
      />
    </Stack.Navigator>
  );
};

export default LoansStack;
