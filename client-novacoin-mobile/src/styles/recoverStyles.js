import { StyleSheet } from 'react-native';

export const recoverStyles = StyleSheet.create({
  // Container
  recoverContainer: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  // Card
  recoverCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 60,
    elevation: 5,
    alignItems: 'center',
  },
  
  // Logo
  recoverLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recoverLogoImg: {
    width: 340,
    height: 60,
    resizeMode: 'contain',
  },
  
  // Subtitle
  recoverSubtitle: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  
  // Title
  recoverTitle: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 35,
    textAlign: 'center',
  },
  
  // Icon/Image
  recoverImage: {
    justifyContent: 'center',
    marginBottom: 30,
  },
  mailCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#eef3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailIcon: {
    color: '#2563eb',
    fontSize: 70,
  },
  
  // Text
  recoverText: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 35,
    textAlign: 'center',
  },
  
  // Form
  recoverForm: {
    width: '100%',
  },
  recoverFormLabel: {
    marginBottom: 12,
    fontWeight: '600',
    color: '#111827',
    fontSize: 15,
  },
  recoverInputGroup: {
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#ffffff',
    marginBottom: 25,
  },
  recoverInputGroupFocused: {
    borderColor: '#2563eb',
    borderWidth: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  recoverInputGroupIcon: {
    color: '#9ca3af',
    marginRight: 12,
    fontSize: 20,
  },
  recoverInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },
  
  // Button
  recoverBtn: {
    width: '100%',
    height: 58,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 5,
  },
  recoverBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Back Button
  backLogin: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginTop: 22,
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Footer
  recoverFooter: {
    marginTop: 45,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  footerItem: {
    alignItems: 'center',
    width: '30%',
  },
  footerItemIcon: {
    color: '#2563eb',
    marginBottom: 10,
    fontSize: 24,
  },
  footerItemTitle: {
    fontSize: 20,
    color: '#111827',
    marginBottom: 10,
    fontWeight: '600',
  },
  footerItemText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 21,
    textAlign: 'center',
  },
});
