// src/features/auth/screens/LoginScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { authStyles } from '../../../styles/authStyles';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../../../../assets/N.novacoin.png';
import shieldImg from '../../../../assets/img/shield.png';
import { ConfirmModal } from '../../../shared/components/ConfirmModal';

const LoginScreen = ({ navigation }) => {
  const { handleLogin, loading, error } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  const onSubmit = async () => {
    const result = await handleLogin(email, password);
    if (result.success) {
      // La navegación se maneja automáticamente por AppNavigator
    }
  };

  return (
    <>
      <ScrollView style={authStyles.authPage} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={authStyles.authContainer}>
          {/* Left Side - Dark Blue Background */}
          <View style={authStyles.authLeft}>
            {/* Glow Effects */}
            <View style={authStyles.glowTop} />
            <View style={authStyles.glowBottom} />
            
            {/* Shield Image Background */}
            <Image source={shieldImg} style={authStyles.shieldImage} resizeMode="contain" />
            
            {/* Logo */}
            <Image source={logoImg} style={authStyles.logo} resizeMode="contain" />
            
            {/* Title */}
            <Text style={authStyles.authLeftTitle}>
              Tu dinero, <Text style={authStyles.authLeftTitleSpan}>tu futuro.</Text>
            </Text>
            
            {/* Text */}
            <Text style={authStyles.authLeftText}>
              Banca segura y confiable para gestionar tus finanzas con tranquilidad.
            </Text>
          </View>

          {/* Right Side - Light Background with Form */}
          <View style={authStyles.authRight}>
            <View style={authStyles.authCard}>
              {/* Welcome Text */}
              <Text style={authStyles.welcomeText}>Bienvenido de nuevo</Text>
              
              {/* Title */}
              <Text style={authStyles.authTitle}>Iniciar sesión</Text>

              {/* Email Input */}
              <View style={authStyles.inputGroup}>
                <MaterialIcons name="email" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={authStyles.inputGroup}>
                <MaterialIcons name="lock" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    style={authStyles.eyeIcon} 
                  />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <View style={authStyles.authOptions}>
                <TouchableOpacity 
                  style={authStyles.authOptionsLabel}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <MaterialIcons 
                    name={rememberMe ? "check-box" : "check-box-outline-blank"} 
                    size={20} 
                    color="#64748b" 
                    style={{ marginRight: 8 }}
                  />
                  <Text>Recordarme</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
                  <Text style={authStyles.authOptionsLink}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={authStyles.loginBtn}
                onPress={onSubmit}
                disabled={loading}
              >
                <Text style={authStyles.loginBtnText}>
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title="Error"
        message="No fue posible iniciar sesión"
        confirmText="Entendido"
        confirmColor="#ef4444"
        icon="close"
        showCancelButton={false}
      />
    </>
  );
};

export default LoginScreen;
