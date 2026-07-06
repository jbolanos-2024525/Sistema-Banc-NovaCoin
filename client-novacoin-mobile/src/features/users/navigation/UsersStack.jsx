// src/features/users/navigation/UsersStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import UsersScreen from '../screens/UsersScreen';
import CreateUser from '../screens/CreateUser';

const Stack = createNativeStackNavigator();

const UsersStack = () => {
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
        name="UsersScreen"
        component={UsersScreen}
        options={{ title: 'Usuarios', headerShown: true }}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUser}
        options={{ title: 'Crear Usuario', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UsersStack;
