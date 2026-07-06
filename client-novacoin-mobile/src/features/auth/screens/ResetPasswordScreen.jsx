// src/features/auth/screens/ResetPasswordScreen.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { recoverStyles } from '../../../styles/recoverStyles';
import logo from '../../../../assets/img/logo2.png';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { token } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setNotification(null);

    if (!newPassword.trim()) {
      setError('La nueva contraseña es requerida.');
      return;
    }
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setNotification({
        type: 'error',
        message: 'El enlace no es válido o ha expirado. Solicita uno nuevo.',
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      // await resetPasswordRequest(token, newPassword);
      setNotification({
        type: 'success',
        message: '¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión.',
      });
      setTimeout(() => navigation.replace('Login'), 3000);
    } catch (err) {
      const msg = 'El enlace ha expirado o no es válido. Solicita uno nuevo.';
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
            <Image source={logo} style={recoverStyles.recoverLogoImg} />
          </View>

          <Text style={recoverStyles.recoverSubtitle}>Restablecer contraseña</Text>
          <Text style={recoverStyles.recoverTitle}>Crea una nueva contraseña</Text>

          {/* ICON */}
          <View style={recoverStyles.recoverImage}>
            <View style={recoverStyles.mailCircle}>
              <MaterialIcons name="lock" size={60} color="#2563eb" />
            </View>
          </View>

          <Text style={recoverStyles.recoverText}>
            Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
          </Text>

          {/* FORM */}
          <View style={recoverStyles.recoverForm}>
            <Text style={recoverStyles.recoverFormLabel}>Nueva contraseña</Text>
            <View style={recoverStyles.recoverInputGroup}>
              <MaterialIcons name="lock" size={18} color="#9ca3af" style={recoverStyles.recoverInputGroupIcon} />
              <TextInput
                style={recoverStyles.recoverInput}
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                <MaterialIcons name={showNew ? 'visibility-off' : 'visibility'} size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <Text style={[recoverStyles.recoverFormLabel, { marginTop: 12 }]}>Confirmar contraseña</Text>
            <View style={recoverStyles.recoverInputGroup}>
              <MaterialIcons name="lock" size={18} color="#9ca3af" style={recoverStyles.recoverInputGroupIcon} />
              <TextInput
                style={recoverStyles.recoverInput}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                <MaterialIcons name={showConfirm ? 'visibility-off' : 'visibility'} size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={recoverStyles.recoverBtn}
              onPress={handleSubmit}
              disabled={loading || notification?.type === 'success'}
            >
              {loading ? (
                <Text style={recoverStyles.recoverBtnText}>Guardando...</Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={recoverStyles.recoverBtnText}>Restablecer contraseña</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={recoverStyles.backLogin} onPress={() => navigation.replace('Login')}>
            <Text style={recoverStyles.backLogin}>← Volver al inicio de sesión</Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={recoverStyles.recoverFooter}>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="verified-user" size={28} color="#2563eb" style={recoverStyles.footerItemIcon} />
              <Text style={recoverStyles.footerItemTitle}>Seguro</Text>
              <Text style={recoverStyles.footerItemText}>Protegemos tu información con los más altos estándares.</Text>
            </View>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="lock" size={28} color="#2563eb" style={recoverStyles.footerItemIcon} />
              <Text style={recoverStyles.footerItemTitle}>Privado</Text>
              <Text style={recoverStyles.footerItemText}>Tu información está siempre encriptada.</Text>
            </View>
            <View style={recoverStyles.footerItem}>
              <MaterialIcons name="headset-mic" size={28} color="#2563eb" style={recoverStyles.footerItemIcon} />
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
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
});

export default ResetPasswordScreen;
