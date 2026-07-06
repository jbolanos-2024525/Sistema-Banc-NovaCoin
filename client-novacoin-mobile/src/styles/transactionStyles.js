import { StyleSheet } from 'react-native';

export const transactionStyles = StyleSheet.create({
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
  
  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  filterTabActive: {
    backgroundColor: '#00f2fe',
    borderColor: '#00f2fe',
  },
  
  filterTabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  
  filterTabTextActive: {
    color: '#0d1117',
    fontWeight: '600',
  },
  
  // Transaction Card
  transactionCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  transactionType: {
    color: '#00f2fe',
    fontSize: 14,
    fontWeight: '600',
  },
  
  transactionDate: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  
  transactionAmount: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  transactionAmountPositive: {
    color: '#22c55e',
  },
  
  transactionAmountNegative: {
    color: '#ef4444',
  },
  
  transactionDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginBottom: 8,
  },
  
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  transactionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  transactionMetaLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
  },
  
  transactionMetaValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.2)',
  },
  
  summaryTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  
  summaryLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  
  summaryValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  summaryTotalLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  summaryTotalValue: {
    color: '#00f2fe',
    fontSize: 20,
    fontWeight: '700',
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
