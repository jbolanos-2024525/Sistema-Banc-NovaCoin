// src/features/employees/navigation/EmployeesStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import EmployeeScreen from '../../employee/screens/EmployeeScreen';
import CreateEmployee from '../../employee/screens/CreateEmployee';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const Stack = createNativeStackNavigator();

const EmployeesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="EmployeesList"
        component={EmployeeScreen}
      />
      <Stack.Screen
        name="CreateEmployee"
        component={CreateEmployee}
      />
    </Stack.Navigator>
  );
};

export default EmployeesStack;
