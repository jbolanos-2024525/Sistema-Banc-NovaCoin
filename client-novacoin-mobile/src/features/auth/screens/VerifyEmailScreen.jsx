// src/features/auth/screens/VerifyEmailScreen.jsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import logo from '../../../../assets/img/logoNovacoin.png';

const VerifyEmailScreen = ({ route, navigation }) => {
  const { token } = route.params || {};
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verificando correo, por favor espera...');

  const handleFinish = useCallback(() => {
    setTimeout(() => navigation.replace('Login'), 2000);
  }, [navigation]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // TODO: Implementar llamada a API
        // const result = await verifyEmailRequest(token);
        // if (result.success) {
        //   setStatus('success');
        //   setMessage('¡Correo verificado exitosamente!');
        //   handleFinish();
        // } else {
        //   setStatus('error');
        //   setMessage(result.message || 'Error al verificar el correo');
        // }
        
        // Simulación por ahora
        setStatus('success');
        setMessage('¡Correo verificado exitosamente!');
        handleFinish();
      } catch (err) {
        setStatus('error');
        setMessage('Error al verificar el correo. El enlace puede haber expirado.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Token no proporcionado. El enlace no es válido.');
    }
  }, [token, handleFinish]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      {status === 'loading' && (
        <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />
      )}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  logo: {
    width: 112,
    height: 112,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    maxWidth: 512,
  },
});

export default VerifyEmailScreen;
