// src/navigation/MainTabs.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../shared/constants/theme';
import AccountsStack from '../features/accounts/navigation/AccountsStack';
import TransactionsStack from '../features/transactions/navigation/TransactionsStack';
import LoansStack from '../features/loans/navigation/LoansStack';
import EmployeesStack from '../features/employees/navigation/EmployeesStack';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Accounts':
              iconName = 'account-balance';
              break;
            case 'Transactions':
              iconName = 'swap-horiz';
              break;
            case 'Loans':
              iconName = 'request-page';
              break;
            case 'Employees':
              iconName = 'badge';
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
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Transactions" component={TransactionsStack} />
      <Tab.Screen name="Loans" component={LoansStack} />
      <Tab.Screen name="Employees" component={EmployeesStack} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
