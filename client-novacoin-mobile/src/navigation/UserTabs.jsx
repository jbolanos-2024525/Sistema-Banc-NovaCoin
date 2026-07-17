// src/navigation/UserTabs.jsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../shared/constants/theme';
import DashboardStack from '../features/dashboard/navigation/DashboardStack';
import AccountStack from '../features/account/navigation/AccountStack';
import LoansStack from '../features/loans/navigation/LoansStack';
import TransactionsStack from '../features/transactions/navigation/TransactionsStack';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Account':
              iconName = 'account-balance';
              break;
            case 'Loans':
              iconName = 'request-page';
              break;
            case 'Transactions':
              iconName = 'swap-horiz';
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
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountStack}
        options={{ tabBarLabel: 'Cuenta' }}
      />
      <Tab.Screen 
        name="Loans" 
        component={LoansStack}
        options={{ tabBarLabel: 'Préstamos' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsStack}
        options={{ tabBarLabel: 'Transacciones' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false, tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default UserTabs;
