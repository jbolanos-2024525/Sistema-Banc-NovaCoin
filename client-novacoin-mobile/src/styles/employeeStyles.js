import { StyleSheet } from 'react-native';

export const employeeStyles = StyleSheet.create({
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
  
  // Employee Card
  employeeCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  employeeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'linear-gradient(135deg, #00f2fe, #4facfe)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  employeeAvatarText: {
    color: '#050c18',
    fontWeight: '700',
    fontSize: 20,
  },
  
  employeeInfo: {
    flex: 1,
  },
  
  employeeName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  employeePosition: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  
  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  
  statusOnLeave: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  statusTextActive: {
    color: '#22c55e',
  },
  
  statusTextInactive: {
    color: '#ef4444',
  },
  
  statusTextOnLeave: {
    color: '#f97316',
  },
  
  // Employee Details
  employeeDetails: {
    marginBottom: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  
  detailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Card Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  actionButtonPrimary: {
    backgroundColor: '#00f2fe',
  },
  
  actionButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  actionButtonTextPrimary: {
    color: '#0d1117',
  },
  
  actionButtonTextSecondary: {
    color: '#ffffff',
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
