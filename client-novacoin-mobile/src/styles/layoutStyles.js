import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  
  // Safe Area Container
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  
  // Screen Container
  screen: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Section Styles
  section: {
    marginBottom: 24,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  
  sectionAction: {
    color: '#00f2fe',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // List Styles
  listContainer: {
    paddingBottom: 16,
  },
  
  listItem: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  listItemPressed: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  
  // Spacer
  spacer: {
    height: 16,
  },
  
  spacerSmall: {
    height: 8,
  },
  
  spacerLarge: {
    height: 24,
  },
  
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  // Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  
  avatarText: {
    color: '#050c18',
    fontWeight: '700',
    fontSize: 14,
  },
  
  avatarTextLarge: {
    fontSize: 20,
  },
  
  avatarTextSmall: {
    fontSize: 12,
  },
  
  // Icon Container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  iconContainerSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  
  iconContainerLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0a1a2f',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 242, 254, 0.2)',
    height: 60,
    paddingHorizontal: 8,
  },
  
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#00f2fe',
  },
  
  tabIcon: {
    marginBottom: 4,
  },
  
  tabLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  
  tabLabelActive: {
    color: '#00f2fe',
    fontWeight: '600',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalContent: {
    backgroundColor: '#161b22',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  modalHeader: {
    marginBottom: 16,
  },
  
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  modalBody: {
    marginBottom: 20,
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  emptyStateIcon: {
    marginBottom: 16,
  },
  
  emptyStateTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Error State
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  errorTitle: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  errorText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
});
