import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import logoImg from '../../../assets/N.novacoin.png';

const menuItems = [
  { label: 'Home', icon: 'home-outline', route: 'Dashboard' },
  { isHeader: true, label: 'GESTIÓN BANCARIA' },
  { label: 'Cuentas', icon: 'person-outline', route: 'Accounts' },
  { label: 'Préstamos', icon: 'card-outline', route: 'Loans' },
  { label: 'Transacciones', icon: 'swap-horizontal-outline', route: 'Transactions' },
  { label: 'Empleados', icon: 'briefcase-outline', route: 'Employees' },
  { label: 'Usuarios', icon: 'people-outline', route: 'Users' },
];

export const CustomSidebar = ({ isVisible, onClose, onNavigate, currentRoute }) => {
  const { user, logout } = useAuthStore();
  const name = user?.fullName || user?.username || user?.email || 'Admin';

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleNavigate = (route) => {
    onNavigate(route);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {/* Header Logo */}
        <View style={styles.sidebarHeader}>
          <Image source={logoImg} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userRole}>Admin</Text>
          </View>
        </View>

        {/* Navigation */}
        <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            if (item.isHeader) {
              return (
                <Text key={index} style={styles.headerLabel}>
                  {item.label}
                </Text>
              );
            }

            const isActive = currentRoute === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => handleNavigate(item.route)}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isActive ? '#00f2fe' : 'rgba(255,255,255,0.6)'}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Logo de fondo N hexagonal */}
          <View style={styles.logoBackground}>
            <View style={styles.hexagon}>
              <Text style={styles.hexagonText}>N</Text>
            </View>
          </View>
        </ScrollView>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactLabel}>CONTÁCTANOS</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color="#00f2fe" />
            <Text style={styles.contactText}>NovaCoin@gmail.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color="#00f2fe" />
            <Text style={styles.contactText}>+502 4521-8763</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'linear-gradient(165deg, #0a1a2f 0%, #050c18 45%, #082d33 100%)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  logo: {
    width: 120,
    height: 36,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#050c18',
    fontWeight: '700',
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userRole: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  navigation: {
    flex: 1,
    paddingVertical: 15,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: 'rgba(0,242,254,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#00f2fe',
  },
  menuIcon: {
    width: 20,
  },
  menuLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '400',
  },
  menuLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  logoBackground: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
    marginTop: 20,
  },
  hexagon: {
    width: 80,
    height: 80,
    backgroundColor: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, transparent 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,242,254,0.3)',
    borderRadius: 12,
  },
  hexagonText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00f2fe',
  },
  contactSection: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  contactLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  contactText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CustomSidebar;
