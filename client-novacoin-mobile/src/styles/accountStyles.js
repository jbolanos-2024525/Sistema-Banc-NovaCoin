import { StyleSheet } from 'react-native';

export const accountStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  
  // Header
  header: {
    backgroundColor: 'linear-gradient(180deg, #0a1a2f 0%, #050c18 100%)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 254, 0.2)',
  },
  
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  
  // Content
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Search Bar
  searchBar: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  searchInput: {
    color: '#ffffff',
    fontSize: 14,
  },
  
  // Account Card
  accountCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  accountName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  accountNumber: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  
  accountBalance: {
    color: '#00f2fe',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  accountType: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  
  statusPending: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  statusTextActive: {
    color: '#22c55e',
  },
  
  statusTextInactive: {
    color: '#ef4444',
  },
  
  statusTextPending: {
    color: '#f97316',
  },
  
  // Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  actionIcon: {
    marginBottom: 4,
  },
  
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
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
  
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    marginTop: 16,
  },
});
