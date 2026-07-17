// src/features/dashboard/navigation/DashboardStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import DashboardHomeScreen from '../screens/DashboardHomeScreen';
import UserDashboardHomeScreen from '../screens/UserDashboardHomeScreen';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={isAdmin ? DashboardHomeScreen : UserDashboardHomeScreen}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
