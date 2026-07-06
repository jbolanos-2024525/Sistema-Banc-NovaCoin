// src/features/dashboard/navigation/DashboardStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import DashboardHomeScreen from '../screens/DashboardHomeScreen';
import UserDashboardHomeScreen from '../screens/UserDashboardHomeScreen';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
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
        name="DashboardHome"
        component={isAdmin ? DashboardHomeScreen : UserDashboardHomeScreen}
        options={{ title: isAdmin ? 'Dashboard Admin' : 'Mi Dashboard', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
