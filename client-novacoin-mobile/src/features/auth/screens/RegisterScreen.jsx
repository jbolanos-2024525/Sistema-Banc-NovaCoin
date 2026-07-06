// src/features/auth/screens/RegisterScreen.jsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { authStyles } from '../../../styles/authStyles';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../../../../assets/N.novacoin.png';
import shieldImg from '../../../../assets/img/shield.png';

const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    dpi: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.surname.trim()) newErrors.surname = 'El apellido es requerido';
    if (!formData.username.trim()) newErrors.username = 'El usuario es requerido';
    if (formData.username.length < 3) newErrors.username = 'Mínimo 3 caracteres';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.dpi.trim()) newErrors.dpi = 'El DPI es requerido';
    if (!/^\d{13}$/.test(formData.dpi)) newErrors.dpi = 'DPI debe tener 13 dígitos';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!/^\d{8}$/.test(formData.phone)) newErrors.phone = 'Teléfono debe tener 8 dígitos';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma la contraseña';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    
    const userData = {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      dpi: formData.dpi,
      phone: formData.phone,
    };

    const result = await handleRegister(userData);
    if (result.success) {
      // La navegación se maneja automáticamente por AppNavigator
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
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
            Únete a <Text style={authStyles.authLeftTitleSpan}>NovaCoin</Text>
          </Text>
          
          {/* Text */}
          <Text style={authStyles.authLeftText}>
            Crea tu cuenta y comienza a gestionar tus finanzas de forma segura y eficiente.
          </Text>
        </View>

        {/* Right Side - Light Background with Form */}
        <View style={authStyles.authRight}>
          <View style={authStyles.authCard}>
            {/* Welcome Text */}
            <Text style={authStyles.welcomeText}>Crear cuenta nueva</Text>
            
            {/* Title */}
            <Text style={authStyles.authTitle}>Registrarse</Text>
            
            {/* Error */}
            {error && <Text style={authStyles.errorText}>{error}</Text>}

            {/* Name Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="person" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Nombre"
                placeholderTextColor="#94a3b8"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Surname Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="person" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Apellido"
                placeholderTextColor="#94a3b8"
                value={formData.surname}
                onChangeText={(value) => updateField('surname', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Username Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="badge" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Usuario"
                placeholderTextColor="#94a3b8"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                autoCapitalize="none"
              />
            </View>

            {/* Email Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="email" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#94a3b8"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* DPI Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="fingerprint" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="DPI (13 dígitos)"
                placeholderTextColor="#94a3b8"
                value={formData.dpi}
                onChangeText={(value) => updateField('dpi', value)}
                keyboardType="numeric"
                maxLength={13}
              />
            </View>

            {/* Phone Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="phone" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Teléfono (8 dígitos)"
                placeholderTextColor="#94a3b8"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
                maxLength={8}
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="lock" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Contraseña"
                placeholderTextColor="#94a3b8"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  style={authStyles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={authStyles.inputGroup}>
              <MaterialIcons name="lock" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#94a3b8"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  style={authStyles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={authStyles.loginBtn}
              onPress={onSubmit}
              disabled={loading}
            >
              <Text style={authStyles.loginBtnText}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>

            {/* Login Text */}
            <View style={authStyles.registerText}>
              <Text>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={authStyles.registerLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
