// src/shared/components/common/Common.jsx

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../constants/theme';

export const Container = ({ children, style, padding = 'md' }) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: theme.spacing.sm };
      case 'md':
        return { padding: theme.spacing.md };
      case 'lg':
        return { padding: theme.spacing.lg };
      case 'xl':
        return { padding: theme.spacing.xl };
      default:
        return { padding: theme.spacing.md };
    }
  };

  return (
    <View style={[styles.container, getPaddingStyle(), style]}>
      {children}
    </View>
  );
};

export const Card = ({ children, style, elevation = 'md' }) => {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'sm':
        return theme.shadows.sm;
      case 'md':
        return theme.shadows.md;
      case 'lg':
        return theme.shadows.lg;
      case 'xl':
        return theme.shadows.xl;
      default:
        return theme.shadows.md;
    }
  };

  return (
    <View style={[styles.card, getElevationStyle(), style]}>
      {children}
    </View>
  );
};

export const Header = ({ title, subtitle, style }) => (
  <View style={[styles.header, style]}>
    <Text style={styles.headerTitle}>{title}</Text>
    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
  </View>
);

export const Loading = ({ size = 'large', color }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator
      size={size}
      color={color || theme.colors.primary.main}
    />
  </View>
);

export const EmptyState = ({ message, icon }) => (
  <View style={styles.emptyState}>
    {icon && icon}
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export const Separator = ({ style }) => (
  <View style={[styles.separator, style]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: '#9ca3af',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },
});
