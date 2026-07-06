// src/features/accounts/navigation/AccountsStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import AdminAccountScreen from '../../adminAccount/screens/AdminAccountScreen';
import AccountScreen from '../../account/screens/AccountScreen';
import CreateAccount from '../../accounts/screens/CreateAccount';

const Stack = createNativeStackNavigator();

const AccountsStack = () => {
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
        name="AccountsList"
        component={isAdmin ? AdminAccountScreen : AccountScreen}
        options={{ title: isAdmin ? 'Gestión de Cuentas' : 'Mi Cuenta' }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{ title: 'Crear Cuenta', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AccountsStack;
