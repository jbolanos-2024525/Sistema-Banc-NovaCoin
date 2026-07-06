import { StyleSheet } from 'react-native';

export const loanStyles = StyleSheet.create({
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
  
  // Loan Card
  loanCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  
  loanClient: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  loanType: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  
  // Status Badge
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  statusPending: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
  },
  
  statusApproved: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  
  statusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  
  statusInMora: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  
  statusPaid: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  statusTextPending: {
    color: '#f97316',
  },
  
  statusTextApproved: {
    color: '#22c55e',
  },
  
  statusTextRejected: {
    color: '#ef4444',
  },
  
  statusTextInMora: {
    color: '#eab308',
  },
  
  statusTextPaid: {
    color: '#3b82f6',
  },
  
  // Loan Details
  loanDetails: {
    marginBottom: 16,
  },
  
  loanDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  loanDetailLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
  },
  
  loanDetailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  loanAmount: {
    color: '#00f2fe',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  // Progress Bar
  progressContainer: {
    marginBottom: 16,
  },
  
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  progressFillPending: {
    backgroundColor: '#f97316',
  },
  
  progressFillApproved: {
    backgroundColor: '#22c55e',
  },
  
  progressFillInMora: {
    backgroundColor: '#eab308',
  },
  
  progressFillPaid: {
    backgroundColor: '#3b82f6',
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
