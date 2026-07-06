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
              iconName = 'dashboard';
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
            case 'Users':
              iconName = 'people';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.secondary.main,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.elevated,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Employees" component={EmployeesStack} />
      <Tab.Screen name="Loans" component={LoansStack} />
      <Tab.Screen name="Transactions" component={TransactionsStack} />
      <Tab.Screen name="UsersStack" component={UsersStack} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;
