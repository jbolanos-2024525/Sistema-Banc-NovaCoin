// src/features/auth/screens/LoginScreen.jsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Container, Card } from '../../../shared/components/common/Common';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { handleLogin, loading, error } = useAuth();

  const onSubmit = async (data) => {
    const result = await handleLogin(data.emailOrUsername, data.password);
    if (result.success) {
      // La navegación se maneja automáticamente por AppNavigator
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Container padding="lg">
        <View style={styles.container}>
          {/* Logo NovaCoin */}
          <View style={styles.logoContainer}>
            <MaterialIcons name="account-balance" size={80} color={theme.colors.primary.main} />
            <Text style={styles.logoText}>NovaCoin</Text>
            <Text style={styles.logoSubtitle}>Banca Móvil Segura</Text>
          </View>

          <Card elevation="lg">
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Correo o Usuario"
              name="emailOrUsername"
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              placeholder="Ingrese su correo o usuario"
              icon="person"
              autoCapitalize="none"
              error={errors.emailOrUsername?.message}
            />

            <Input
              label="Contraseña"
              name="password"
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              placeholder="Ingrese su contraseña"
              icon="lock"
              secureTextEntry
              error={errors.password?.message}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => {}}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidó su contraseña?</Text>
            </TouchableOpacity>

            <Button
              title="Iniciar Sesión"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              size="large"
              style={styles.button}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tiene cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Regístrese</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginTop: theme.spacing.sm,
  },
  logoSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  registerText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginRight: theme.spacing.xs,
  },
  registerLink: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default LoginScreen;
