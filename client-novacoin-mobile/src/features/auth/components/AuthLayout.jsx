// src/features/auth/components/AuthLayout.jsx

import React from 'react';
import { View, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';

const AuthLayout = ({ children, title }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialIcons name="account-balance" size={48} color="#c084fc" />
          <Text style={styles.brandName}>NovaCoin</Text>
          <Text style={styles.tagline}>Tu dinero, tu futuro.</Text>
          <Text style={styles.description}>
            Accede a tu cuenta y administra tus finanzas de manera segura.
          </Text>
        </View>

        <View style={styles.securityBadge}>
          <MaterialIcons name="verified-user" size={20} color="#10b981" />
          <Text style={styles.securityText}>Seguridad bancaria garantizada</Text>
        </View>

        <View style={styles.formContainer}>
          {title && <Text style={styles.formTitle}>{title}</Text>}
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16171d',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c084fc',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  securityText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AuthLayout;
