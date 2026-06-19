// src/features/employees/navigation/EmployeesStack.jsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../../../shared/constants/theme';
import EmployeesList from '../screens/EmployeesList';
import EmployeeDetail from '../screens/EmployeeDetail';

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
        component={EmployeesList}
        options={{ title: 'Empleados' }}
      />
      <Stack.Screen
        name="EmployeeDetail"
        component={EmployeeDetail}
        options={{ title: 'Detalle de Empleado' }}
      />
    </Stack.Navigator>
  );
};

export default EmployeesStack;
