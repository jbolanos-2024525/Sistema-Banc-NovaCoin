import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

export const CustomHeader = ({ title, showBack = false, onBackPress, showMenu = true, onMenuPress }) => {
  const { user } = useAuthStore();
  const name = user?.fullName || user?.username || user?.email || 'Admin';

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="menu" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : null}

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.85)" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0a1a2f',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 254, 0.2)',
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins',
    letterSpacing: 0.4,
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    backgroundColor: '#00f2fe',
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: '#081324',
  },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#050c18',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default CustomHeader;
