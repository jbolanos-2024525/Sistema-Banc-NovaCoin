// src/navigation/AdminTabs.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../shared/constants/theme';
import DashboardStack from '../features/dashboard/navigation/DashboardStack';
import AccountsStack from '../features/accounts/navigation/AccountsStack';
import EmployeesStack from '../features/employees/navigation/EmployeesStack';
import LoansStack from '../features/loans/navigation/LoansStack';
import TransactionsStack from '../features/transactions/navigation/TransactionsStack';
import UsersStack from '../features/users/navigation/UsersStack';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Accounts':
              iconName = 'account-balance';
              break;
            case 'Employees':
              iconName = 'badge';
              break;
            case 'Loans':
              iconName = 'request-page';
              break;
            case 'Transactions':
              iconName = 'swap-horiz';
              break;
            case 'UsersStack':
              iconName = 'group';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00f2ea',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#001233',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Accounts" component={AccountsStack} options={{ tabBarLabel: 'Cuentas' }} />
      <Tab.Screen name="Loans" component={LoansStack} options={{ tabBarLabel: 'Préstamos' }} />
      <Tab.Screen name="Transactions" component={TransactionsStack} options={{ tabBarLabel: 'Transacciones' }} />
      <Tab.Screen name="Employees" component={EmployeesStack} options={{ tabBarLabel: 'Empleados' }} />
      <Tab.Screen name="UsersStack" component={UsersStack} options={{ tabBarLabel: 'Usuarios' }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false, tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;
