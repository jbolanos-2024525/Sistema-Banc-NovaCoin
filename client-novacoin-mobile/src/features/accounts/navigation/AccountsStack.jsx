// src/features/accounts/navigation/AccountsStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import AccountsList from '../screens/AccountsList';
import AccountDetail from '../screens/AccountDetail';
import CreateAccount from '../screens/CreateAccount';

const Stack = createNativeStackNavigator();

const AccountsStack = () => {
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
        name="AccountsList"
        component={AccountsList}
        options={{ title: 'Mis Cuentas' }}
      />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetail}
        options={{ title: 'Detalle de Cuenta' }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{ title: 'Crear Cuenta' }}
      />
    </Stack.Navigator>
  );
};

export default AccountsStack;
