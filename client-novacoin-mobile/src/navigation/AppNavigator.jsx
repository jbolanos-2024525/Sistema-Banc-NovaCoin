// src/navigation/AppNavigator.jsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../shared/store/authStore';
import AuthStack from './AuthStack';
import AdminTabs from './AdminTabs';
import UserTabs from './UserTabs';
import { theme } from '../shared/constants/theme';

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // Esperar a que el store se hidrate
      await useAuthStore.persist.rehydrate();
      setIsReady(true);
    };

    prepare();
  }, []);

  if (!isReady || !hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // Determinar si es admin
  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.roles?.includes('ADMIN_ROLE') || user?.isAdmin === true;
  
  // Si está autenticado pero no hay usuario, limpiar el estado
  const validAuth = isAuthenticated && user !== null;
  
  console.log('AppNavigator - isAuthenticated:', isAuthenticated);
  console.log('AppNavigator - user:', user);
  console.log('AppNavigator - isAdmin:', isAdmin);
  console.log('AppNavigator - validAuth:', validAuth);

  return (
    <NavigationContainer>
      {!validAuth ? (
        <AuthStack />
      ) : isAdmin ? (
        <AdminTabs />
      ) : (
        <UserTabs />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
});

export default AppNavigator;
