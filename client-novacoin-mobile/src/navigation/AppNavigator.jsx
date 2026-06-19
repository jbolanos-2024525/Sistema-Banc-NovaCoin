// src/navigation/AppNavigator.jsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../shared/store/authStore';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { theme } from '../shared/constants/theme';

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
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
