// src/features/auth/screens/RegisterScreen.jsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { Container, Card } from '../../../shared/components/common/Common';
import { useAuth } from '../hooks/useAuth';

const RegisterScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { handleRegister, loading, error } = useAuth();

  const onSubmit = async (data) => {
    const userData = {
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      password: data.password,
      dpi: data.dpi,
      phone: data.phone,
    };

    const result = await handleRegister(userData);
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
            <MaterialIcons name="account-balance" size={60} color={theme.colors.primary.main} />
            <Text style={styles.logoText}>NovaCoin</Text>
            <Text style={styles.logoSubtitle}>Registro de Cliente</Text>
          </View>

          <Card elevation="lg">
            <Text style={styles.title}>Crear Cuenta</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color={theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Nombre"
              name="name"
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              placeholder="Ingrese su nombre"
              icon="person"
              autoCapitalize="words"
              error={errors.name?.message}
            />

            <Input
              label="Apellido"
              name="surname"
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              placeholder="Ingrese su apellido"
              icon="person"
              autoCapitalize="words"
              error={errors.surname?.message}
            />

            <Input
              label="Usuario"
              name="username"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
              }}
              placeholder="Ingrese un nombre de usuario"
              icon="badge"
              autoCapitalize="none"
              error={errors.username?.message}
            />

            <Input
              label="Correo Electrónico"
              name="email"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
              }}
              placeholder="ejemplo@correo.com"
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />

            <Input
              label="DPI"
              name="dpi"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                pattern: { value: /^\d{13}$/, message: 'DPI debe tener 13 dígitos' }
              }}
              placeholder="Ingrese su DPI (13 dígitos)"
              icon="fingerprint"
              keyboardType="numeric"
              maxLength={13}
              error={errors.dpi?.message}
            />

            <Input
              label="Teléfono"
              name="phone"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                pattern: { value: /^\d{8}$/, message: 'Teléfono debe tener 8 dígitos' }
              }}
              placeholder="Ingrese su teléfono (8 dígitos)"
              icon="phone"
              keyboardType="phone-pad"
              maxLength={8}
              error={errors.phone?.message}
            />

            <Input
              label="Contraseña"
              name="password"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' }
              }}
              placeholder="Mínimo 8 caracteres"
              icon="lock"
              secureTextEntry
              error={errors.password?.message}
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              control={control}
              rules={{ 
                required: 'Este campo es requerido',
                validate: (value) => {
                  const password = control._formValues.password;
                  return value === password || 'Las contraseñas no coinciden';
                }
              }}
              placeholder="Repita su contraseña"
              icon="lock"
              secureTextEntry
              error={errors.confirmPassword?.message}
            />

            <Button
              title="Registrarse"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              size="large"
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tiene cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Inicie Sesión</Text>
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
    marginBottom: theme.spacing.lg,
  },
  logoText: {
    fontSize: theme.typography.fontSize.xxxl,
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
  button: {
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    marginRight: theme.spacing.xs,
  },
  loginLink: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default RegisterScreen;
