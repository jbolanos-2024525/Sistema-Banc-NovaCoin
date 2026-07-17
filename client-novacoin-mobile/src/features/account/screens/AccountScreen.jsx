// src/features/account/screens/AccountScreen.jsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../shared/constants/theme';
import { useAccountStore } from '../store/accountStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { authService } from '../../../shared/api/authClient';
import CustomHeader from '../../../shared/components/layout/CustomHeader';

const ESTADO_COLOR = {
  ACTIVA: '#00f2fe',
  BLOQUEADA: '#f59e0b',
  CANCELADA: '#ef4444'
};

const formatCurrency = (saldo, moneda) => {
  const divisa = moneda || 'GTQ';
  const simbolo = divisa === 'GTQ' ? 'Q' : '$';
  return `${simbolo} ${Number(saldo || 0).toFixed(2)}`;
};

const AccountCard = ({ cuenta }) => {
  const colorEstado = ESTADO_COLOR[cuenta?.EstadoCuenta || cuenta?.estadoCuenta] || '#9ca3af';
  
  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#050c18']}
      style={styles.accountCard}
    >
      <View style={styles.cardGlow} />
      
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardType}>{cuenta?.TipoCuenta || cuenta?.tipoCuenta || 'Cuenta Bancaria'}</Text>
          <Text style={styles.cardNumber}>{cuenta?.NumeroCuenta || cuenta?.numeroCuenta || '---'}</Text>
        </View>
        <Image 
          source={require('../../../../assets/img/Logo3.png')} 
          style={styles.cardLogo}
          resizeMode="contain"
        />
      </View>

      <View>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceValue}>{formatCurrency(cuenta?.Saldo || cuenta?.saldo, cuenta?.Moneda || cuenta?.moneda)}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          Estado:{' '}
          <Text style={[styles.footerText, { color: colorEstado }]}>
            {cuenta?.EstadoCuenta || cuenta?.estadoCuenta || 'PENDIENTE'}
          </Text>
        </Text>
        <Text style={styles.footerText}>Moneda: {cuenta?.Moneda || cuenta?.moneda || 'GTQ'}</Text>
      </View>
    </LinearGradient>
  );
};

const AccountScreen = () => {
  const { cuentas, fetchMisCuentas, formatCurrency } = useAccountStore();
  const tokenUser = useAuthStore((state) => state.user);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosNovaCoin = async () => {
      try {
        await Promise.all([
          fetchMisCuentas(),
          // Obtener perfil detallado del usuario
          authService.getProfile().then((response) => {
            console.log('Profile response in AccountScreen:', response);
            const data = response.data?.data || response.data;
            if (data) {
              setDbUser(data);
            }
          }).catch((error) => {
            console.error('Error al obtener perfil:', error);
          })
        ]);
      } catch (error) {
        console.error('Error al sincronizar los datos de NovaCoin:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosNovaCoin();
  }, [fetchMisCuentas]);

  const usuarioFinal = dbUser || tokenUser;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f2fe" />
        <Text style={styles.loadingText}>Sincronizando cuentas con NovaCoin...</Text>
      </View>
    );
  }

  const camposMapeados = [
    { 
      label: 'Nombres', 
      value: usuarioFinal?.firstName || usuarioFinal?.FirstName || usuarioFinal?.nombre || usuarioFinal?.Nombre || usuarioFinal?.name || usuarioFinal?.Name || usuarioFinal?.fullName || 'No asignado' 
    },
    { 
      label: 'Apellidos', 
      value: usuarioFinal?.lastName || usuarioFinal?.LastName || usuarioFinal?.apellido || usuarioFinal?.Apellido || usuarioFinal?.surname || usuarioFinal?.Surname || 'No asignado' 
    },
    { 
      label: 'Nombre de Usuario',  
      value: usuarioFinal?.username || usuarioFinal?.Username || usuarioFinal?.usuario || usuarioFinal?.Usuario ? `@${usuarioFinal.username || usuarioFinal.Username || usuarioFinal.usuario || usuarioFinal.Usuario}` : 'Sin usuario',
      mono: true, 
      accent: true 
    },
    { 
      label: 'Correo Electrónico', 
      value: usuarioFinal?.email || usuarioFinal?.Email || usuarioFinal?.correo || usuarioFinal?.Correo || 'No asignado', 
      mono: true 
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader title="Cuenta" showMenu={false} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Cuenta Bancaria</Text>
        <Text style={styles.headerSubtitle}>
          Visualiza el estado financiero de tu perfil en <Text style={styles.highlight}>NovaCoin</Text>.
        </Text>
      </View>

      {/* Cuentas Bancarias - Tarjetas estilo web */}
      <View style={styles.accountsContainer}>
        {cuentas.length > 0 ? (
          cuentas.map((cuenta, index) => (
            <AccountCard 
              key={cuenta._id || cuenta.id || index} 
              cuenta={cuenta} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="account-balance" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tienes cuentas bancarias registradas.</Text>
            <Text style={styles.emptySubtext}>Contacta a tu asesor NovaCoin para crear una cuenta.</Text>
          </View>
        )}
      </View>

      {/* Información Oficial del Titular */}
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <View style={styles.infoCardAccent} />
          <Text style={styles.infoCardTitle}>Información Oficial del Titular</Text>
        </View>
        <View style={styles.infoGrid}>
          {camposMapeados.map(({ label, value, mono, accent }) => (
            <View key={label} style={styles.infoField}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <Text style={[styles.fieldValue, mono && styles.fieldValueMono, accent && styles.fieldValueAccent]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b111e',
  },
  contentContainer: {
    padding: 20,
    gap: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b111e',
  },
  loadingText: {
    color: '#00f2fe',
    marginTop: 16,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  highlight: {
    color: '#00f2fe',
    fontWeight: '600',
  },
  accountsContainer: {
    gap: 24,
  },
  accountCard: {
    borderRadius: 12,
    padding: 28,
    minHeight: 220,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  cardGlow: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(0,242,254,0.05)',
    borderRadius: 80,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    color: '#00f2fe',
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 17,
    fontFamily: 'monospace',
    letterSpacing: 0.15,
    color: '#e5e7eb',
    fontWeight: '500',
    marginTop: 8,
  },
  cardLogo: {
    width: 100,
    height: 35,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
  },
  balanceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 6,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00f2fe',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 11,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  infoCardAccent: {
    width: 3,
    height: 14,
    backgroundColor: '#00f2fe',
    borderRadius: 2,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: '#9ca3af',
  },
  infoGrid: {
    gap: 24,
  },
  infoField: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  fieldValueMono: {
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  fieldValueAccent: {
    color: '#00f2fe',
  },
});

export default AccountScreen;
