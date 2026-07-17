// src/features/account/navigation/AccountStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import AccountScreen from '../screens/AccountScreen';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MyAccount"
        component={AccountScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
