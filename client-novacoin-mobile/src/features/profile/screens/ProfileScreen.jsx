// src/features/profile/screens/ProfileScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, Header } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { useProfile } from '../hooks/useProfile';
import { useAuthStore } from '../../../shared/store/authStore';
import CustomHeader from '../../../shared/components/layout/CustomHeader';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';

const ProfileScreen = () => {
  const { profile, loading, error, fetchProfile } = useProfile();
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const avatarDefault = (
    <View style={[styles.avatar, { backgroundColor: 'rgba(59,130,246,0.2)' }]}>
      <MaterialIcons name="person" size={64} color="#3b82f6" />
    </View>
  );

  if (loading && !profile) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Perfil" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Container padding="md">
        <Header
          title="Mi Perfil"
          subtitle="Gestiona tu información personal"
        />

        {error && (
          <Card elevation="sm" style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        <Card elevation="lg" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile?.avatar ? (
              <View style={styles.avatar}>
                <MaterialIcons name="image" size={64} color={theme.colors.primary.main} />
              </View>
            ) : avatarDefault}
          </View>
          <Text style={styles.displayName}>{profile?.displayName || profile?.name || 'Usuario'}</Text>
          <Text style={styles.username}>@{profile?.username || 'usuario'}</Text>
        </Card>

        <Card elevation="md" style={styles.formCard}>
          <Text style={styles.formTitle}>Información Personal</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre de Visualización</Text>
              <Text style={styles.infoValue}>{profile?.displayName || profile?.name || '—'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{profile?.phone || '—'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{profile?.email || '—'}</Text>
            </View>
          </View>
        </Card>

        <Card elevation="md" style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Opciones de Cuenta</Text>
          
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            icon={<MaterialIcons name="logout" size={20} color={theme.colors.white} />}
            style={styles.logoutButton}
          />
        </Card>
      </Container>
      </ScrollView>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta."
        confirmText="Cerrar Sesión"
        confirmColor="#ef4444"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 24,
  },
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
  },
  profileCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    backgroundColor: '#1e293b',
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#ffffff',
    textAlign: 'center',
  },
  username: {
    fontSize: theme.typography.fontSize.base,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: '#1e293b',
  },
  formTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoContent: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.base,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionsCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: '#1e293b',
  },
  actionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#ffffff',
    marginBottom: theme.spacing.md,
  },
  logoutButton: {
    marginBottom: theme.spacing.md,
  },
});

export default ProfileScreen;
