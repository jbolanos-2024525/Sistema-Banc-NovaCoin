// src/features/auth/screens/RecoverScreen.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { recoverStyles } from '../../../styles/recoverStyles';
import logoImg from '../../../../assets/N.novacoin.png';

const RecoverScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setNotification(null);
    setError('');

    if (!email.trim()) {
      setError('El correo electrónico es requerido.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      // await forgotPasswordRequest(email);
      setNotification({
        type: 'success',
        message: `Se ha enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
      });
      setEmail('');
    } catch (err) {
      const msg = 'No se pudo enviar el correo. Intenta de nuevo más tarde.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={recoverStyles.recoverContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={recoverStyles.recoverCard}>

          {/* NOTIFICACIÓN BANNER */}
          {notification && (
            <View style={[
              styles.notification,
              { backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2' }
            ]}>
              <MaterialIcons 
                name={notification.type === 'success' ? 'check-circle' : 'error'} 
                size={20} 
                color={notification.type === 'success' ? '#059669' : '#dc2626'}
              />
              <Text style={[
                styles.notificationText,
                { color: notification.type === 'success' ? '#065f46' : '#991b1b' }
              ]}>
                {notification.message}
              </Text>
            </View>
          )}

          {/* LOGO */}
          <View style={recoverStyles.recoverLogo}>
            <Image source={logoImg} style={recoverStyles.recoverLogoImg} />
          </View>

          <Text style={recoverStyles.recoverSubtitle}>Recuperar contraseña</Text>
          <Text style={recoverStyles.recoverTitle}>¿Olvidaste tu contraseña?</Text>

          {/* ICON */}
          <View style={recoverStyles.recoverImage}>
            <View style={recoverStyles.mailCircle}>
              <MaterialIcons name="email" size={70} color="#2563eb" />
            </View>
          </View>

          <Text style={recoverStyles.recoverText}>
            No te preocupes, sucede. Ingresa tu correo electrónico
            y te enviaremos un enlace para restablecer tu contraseña.
          </Text>

          {/* FORM */}
          <View style={recoverStyles.recoverForm}>
            <Text style={recoverStyles.recoverFormLabel}>Correo electrónico</Text>

            <View style={recoverStyles.recoverInputGroup}>
              <MaterialIcons name="email" size={20} color="#9ca3af" style={recoverStyles.recoverInputGroupIcon} />
              <TextInput
                style={recoverStyles.recoverInput}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={recoverStyles.recoverBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={recoverStyles.recoverBtnText}>Enviando...</Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={recoverStyles.recoverBtnText}>Enviar enlace de recuperación</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={recoverStyles.backLogin} onPress={() => navigation.goBack()}>
            <Text style={recoverStyles.backLogin}>← Volver al inicio de sesión</Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={recoverStyles.recoverFooter}>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="verified-user" size={24} color="#2563eb" style={recoverStyles.footerItemIcon} />
              <Text style={recoverStyles.footerItemTitle}>Seguro</Text>
              <Text style={recoverStyles.footerItemText}>Protegemos tu información con los más altos estándares.</Text>
            </View>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="lock" size={24} color="#2563eb" style={recoverStyles.footerItemIcon} />
              <Text style={recoverStyles.footerItemTitle}>Privado</Text>
              <Text style={recoverStyles.footerItemText}>Tu información está siempre encriptada.</Text>
            </View>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="headset-mic" size={24} color="#2563eb" style={recoverStyles.footerItemIcon} />
              <Text style={recoverStyles.footerItemTitle}>Soporte 24/7</Text>
              <Text style={recoverStyles.footerItemText}>Estamos aquí para ayudarte siempre.</Text>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 8,
    fontSize: 14,
  },
});

export default RecoverScreen;
