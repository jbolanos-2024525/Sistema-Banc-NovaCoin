// src/features/employees/navigation/EmployeesStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import EmployeeScreen from '../../employee/screens/EmployeeScreen';
import CreateEmployee from '../../employee/screens/CreateEmployee';

const Stack = createNativeStackNavigator();

const EmployeesStack = () => {
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
        name="EmployeesList"
        component={EmployeeScreen}
        options={{ title: 'Empleados' }}
      />
      <Stack.Screen
        name="CreateEmployee"
        component={CreateEmployee}
        options={{ title: 'Crear Empleado', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default EmployeesStack;
