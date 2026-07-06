// src/features/account/navigation/AccountStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import AccountScreen from '../screens/AccountScreen';

const Stack = createNativeStackNavigator();

const AccountStack = () => {
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
        name="MyAccount"
        component={AccountScreen}
        options={{ title: 'Mi Cuenta', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
