// src/navigation/AuthStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../shared/constants/theme';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
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
        name="Login"
        component={LoginScreen}
        options={{ title: 'Iniciar Sesión', headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registrarse', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
