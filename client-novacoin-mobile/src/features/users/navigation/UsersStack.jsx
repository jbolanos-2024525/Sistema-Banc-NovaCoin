// src/features/users/navigation/UsersStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import UsersScreen from '../screens/UsersScreen';
import CreateUser from '../screens/CreateUser';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const Stack = createNativeStackNavigator();

const UsersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="UsersScreen"
        component={UsersScreen}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUser}
      />
    </Stack.Navigator>
  );
};

export default UsersStack;
