import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  // Container
  authPage: {
    flex: 1,
    width: '100%',
  },
  authContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  authLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#020817',
    position: 'relative',
    overflow: 'hidden',
  },
  authRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8fbff',
    position: 'relative',
  },
  
  // Logo
  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  
  // Text
  welcomeText: {
    color: '#4f7cff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  authTitle: {
    fontSize: 42,
    color: '#0f172a',
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 42,
    fontWeight: '800',
  },
  authLeftTitle: {
    fontSize: 48,
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 46,
    fontWeight: '800',
    textAlign: 'center',
  },
  authLeftTitleSpan: {
    color: '#52ffd8',
    textShadowColor: 'rgba(82, 255, 216, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  authLeftText: {
    fontSize: 16,
    color: '#d7e2f0',
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 300,
  },
  
  // Card
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 34,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 60,
    elevation: 10,
  },
  
  // Input Group
  inputGroup: {
    position: 'relative',
    marginBottom: 22,
    borderRadius: 18,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 70,
    borderWidth: 1,
    borderColor: '#dbe3ee',
    borderRadius: 18,
    paddingHorizontal: 58,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#0f172a',
  },
  inputFocused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  inputIcon: {
    position: 'absolute',
    left: 20,
    top: 35,
    color: '#94a3b8',
    fontSize: 18,
    zIndex: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 35,
    color: '#94a3b8',
    fontSize: 20,
    zIndex: 5,
  },
  
  // Options
  authOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    fontSize: 15,
  },
  authOptionsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#64748b',
    fontSize: 15,
  },
  authOptionsLink: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
  },
  
  // Button
  loginBtn: {
    width: '100%',
    height: 68,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 35,
    elevation: 8,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },
  
  // Error
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 10,
  },
  
  // Shield Image
  shieldImage: {
    position: 'absolute',
    width: 400,
    height: 400,
    resizeMode: 'contain',
    opacity: 0.13,
    top: '50%',
    left: -100,
    transform: [{ rotate: '-45deg' }],
  },
  
  // Glow effects
  glowTop: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(0, 140, 255, 0.14)',
    top: -150,
    left: -150,
  },
  glowBottom: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 180, 255, 0.12)',
    bottom: -110,
    right: -110,
  },
  
  // Register text
  registerText: {
    marginTop: 35,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
  },
  registerLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
