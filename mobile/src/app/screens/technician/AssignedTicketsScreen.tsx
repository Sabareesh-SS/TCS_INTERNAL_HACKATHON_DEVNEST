import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { LoadingView } from '../../../components/LoadingView';
import { Ticket, TicketStatus } from '../../../types/ticket';
import { ticketService } from '../../../services/ticketService';
import { useAuth } from '../../../hooks/useAuth';
import { formatDate } from '../../../utils/validators';

interface AssignedTicketsScreenProps {
  navigation: any;
}

export const AssignedTicketsScreen: React.FC<AssignedTicketsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'in_progress' | 'awaiting_parts' | 'resolved'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getAssignedTickets(user?.id);
      setTickets(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const filtered = tickets.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  return (
    <View style={styles.container}>
      <HeaderBar
        title="ASSIGNED REPAIRS"
        subtitle={`TOTAL TICKETS: ${tickets.length}`}
      />

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
        >
          <Text style={[typography.button, activeTab === 'all' ? styles.tabTextActive : styles.tabText]}>
            [ALL ({tickets.length})]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('assigned')}
          style={[styles.tabBtn, activeTab === 'assigned' && styles.tabBtnActive]}
        >
          <Text style={[typography.button, activeTab === 'assigned' ? styles.tabTextActive : styles.tabText]}>
            [NEW ({tickets.filter(t => t.status === 'assigned').length})]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('in_progress')}
          style={[styles.tabBtn, activeTab === 'in_progress' && styles.tabBtnActive]}
        >
          <Text style={[typography.button, activeTab === 'in_progress' ? styles.tabTextActive : styles.tabText]}>
            [IN PROGRESS ({tickets.filter(t => t.status === 'in_progress').length})]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('resolved')}
          style={[styles.tabBtn, activeTab === 'resolved' && styles.tabBtnActive]}
        >
          <Text style={[typography.button, activeTab === 'resolved' ? styles.tabTextActive : styles.tabText]}>
            [RESOLVED ({tickets.filter(t => t.status === 'resolved').length})]
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingView message="FETCHING FIELD ASSIGNMENTS..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={loadData}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={[typography.caption, styles.emptyText]}>
                NO TICKETS FOUND IN THIS CATEGORY
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={[typography.code, styles.ticketId]}>{item.id}</Text>
                <View style={styles.badgeRow}>
                  <StatusBadge status={item.priority} size="sm" />
                  <StatusBadge status={item.status} size="sm" />
                </View>
              </View>

              <Text style={[typography.h3, styles.deviceTitle]}>
                {item.incident.deviceName}
              </Text>

              <Text style={[typography.bodySmall, styles.locationText]}>
                ROOM: {item.incident.classroomName}
              </Text>

              <View style={styles.symptomBox}>
                <Text style={[typography.caption, styles.symptomLabel]}>SYMPTOM REPORTED BY FACULTY</Text>
                <Text style={[typography.bodySmall, styles.symptomText]} numberOfLines={2}>
                  {item.incident.symptomCategory}: {item.incident.symptomDescription}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={[typography.caption, styles.dateText]}>
                  Created: {formatDate(item.createdAt)}
                </Text>
                <Text style={[typography.button, styles.viewText]}>VIEW DETAILS &gt;</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  tabBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontSize: 11,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ticketId: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  deviceTitle: {
    color: colors.textPrimary,
    marginTop: 2,
  },
  locationText: {
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  symptomBox: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  symptomLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  symptomText: {
    color: colors.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  dateText: {
    color: colors.textMuted,
  },
  viewText: {
    color: colors.accent,
    fontSize: 12,
  },
});
