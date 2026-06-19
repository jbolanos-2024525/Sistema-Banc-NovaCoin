// src/features/profile/screens/ProfileScreen.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { Container, Card, Loading, Header } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { useProfile } from '../hooks/useProfile';
import { useAuthStore } from '../../../shared/store/authStore';

const ProfileScreen = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const { logout } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        email: profile.email || '',
      });
    }
  }, [profile, reset]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      setIsEditMode(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro de que desea cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const avatarDefault = (
    <View style={[styles.avatar, { backgroundColor: theme.colors.primary.main + '10' }]}>
      <MaterialIcons name="person" size={64} color={theme.colors.primary.main} />
    </View>
  );

  if (loading && !profile) {
    return <Loading />;
  }

  return (
    <ScrollView>
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
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Información Personal</Text>
            <Button
              title={isEditMode ? 'Cancelar' : 'Editar'}
              onPress={handleEditToggle}
              variant="outline"
              size="small"
              icon={<MaterialIcons name={isEditMode ? 'close' : 'edit'} size={20} color={theme.colors.primary.main} />}
            />
          </View>

          <Input
            label="Nombre de Visualización"
            name="displayName"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Tu nombre de visualización"
            icon="person"
            disabled={!isEditMode}
            error={errors.displayName?.message}
          />

          <Input
            label="Teléfono"
            name="phone"
            control={control}
            rules={{ 
              pattern: { value: /^\+?\d{8,15}$/, message: 'Número de teléfono inválido' }
            }}
            placeholder="+502 1234 5678"
            icon="phone"
            keyboardType="phone-pad"
            disabled={!isEditMode}
            error={errors.phone?.message}
          />

          <Input
            label="Correo Electrónico"
            name="email"
            control={control}
            rules={{ 
              required: 'Este campo es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo electrónico inválido' }
            }}
            placeholder="tu@ejemplo.com"
            icon="email"
            keyboardType="email-address"
            disabled={!isEditMode}
            error={errors.email?.message}
          />

          {isEditMode && (
            <Button
              title="Guardar Cambios"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              size="large"
              icon={<MaterialIcons name="save" size={20} color={theme.colors.white} />}
              style={styles.saveButton}
            />
          )}
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
  );
};

const styles = StyleSheet.create({
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
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
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
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  username: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
  actionsCard: {
    marginBottom: theme.spacing.lg,
  },
  actionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  logoutButton: {
    marginBottom: theme.spacing.md,
  },
});

export default ProfileScreen;
