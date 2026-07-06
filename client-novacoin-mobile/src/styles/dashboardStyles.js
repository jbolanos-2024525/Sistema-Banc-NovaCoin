import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
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
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins',
    letterSpacing: 0.4,
  },
  
  // Content
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  statIconBlue: {
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
  },
  
  statIconGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  
  statIconPurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  
  statIconOrange: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  statChangePositive: {
    color: '#22c55e',
  },
  
  statChangeNegative: {
    color: '#ef4444',
  },
  
  // Recent Activity
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  
  activityCard: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  activityType: {
    color: '#00f2fe',
    fontSize: 14,
    fontWeight: '600',
  },
  
  activityDate: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  
  activityAmount: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  activityAmountPositive: {
    color: '#22c55e',
  },
  
  activityAmountNegative: {
    color: '#ef4444',
  },
  
  activityDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  quickActionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
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
  
  // Floating Action Button
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
});
