import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAuth } from '../../../hooks/useAuth';
import { ticketService } from '../../../services/ticketService';
import { Ticket } from '../../../types/ticket';
import { formatDate } from '../../../utils/validators';

interface TechnicianHomeScreenProps {
  navigation: any;
}

export const TechnicianHomeScreen: React.FC<TechnicianHomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function load() {
      const data = await ticketService.getAssignedTickets(user?.id);
      setTickets(data);
    }
    load();
  }, [user?.id]);

  const assignedCount = tickets.filter(t => t.status === 'assigned').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="TECHNICIAN CONSOLE"
        subtitle={user?.fullName ? `ENGINEER: ${user.fullName.toUpperCase()}` : 'FIELD AV OPS'}
        badgeText="TECHNICIAN"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Metric Cards Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[typography.caption, styles.metricLabel]}>NEW ASSIGNED</Text>
            <Text style={[typography.h1, styles.metricVal]}>{assignedCount}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[typography.caption, styles.metricLabel]}>IN PROGRESS</Text>
            <Text style={[typography.h1, styles.metricVal, { color: colors.warning }]}>
              {inProgressCount}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[typography.caption, styles.metricLabel]}>RESOLVED</Text>
            <Text style={[typography.h1, styles.metricVal, { color: colors.success }]}>
              {resolvedCount}
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AssignedTickets')}
          style={styles.primaryActionCard}
        >
          <View style={styles.actionTop}>
            <Text style={[typography.h3, styles.actionTitle]}>[OPEN ASSIGNED REPAIR QUEUE]</Text>
            <Text style={[typography.button, styles.actionLink]}>VIEW ALL &gt;</Text>
          </View>
          <Text style={[typography.bodySmall, styles.actionDesc]}>
            Review pre-diagnostic faculty check logs, inspect hardware wiring diagrams, and update repair statuses.
          </Text>
        </TouchableOpacity>

        {/* Recent Urgent Ticket */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, styles.sectionTitle]}>URGENT DISPATCH QUEUE</Text>
        </View>

        {tickets.slice(0, 3).map(ticket => (
          <TouchableOpacity
            key={ticket.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TicketDetails', { ticketId: ticket.id })}
            style={styles.ticketCard}
          >
            <View style={styles.ticketTopRow}>
              <Text style={[typography.code, styles.ticketId]}>{ticket.id}</Text>
              <View style={styles.badges}>
                <StatusBadge status={ticket.priority} size="sm" />
                <StatusBadge status={ticket.status} size="sm" />
              </View>
            </View>

            <Text style={[typography.h3, styles.ticketDevice]}>
              {ticket.incident.deviceName}
            </Text>
            <Text style={[typography.bodySmall, styles.ticketLocation]}>
              ROOM: {ticket.incident.classroomName}
            </Text>

            <View style={styles.evidenceSnippet}>
              <Text style={[typography.caption, styles.evidenceLabel]}>FACULTY DIAGNOSTIC EVIDENCE</Text>
              <Text style={[typography.bodySmall, styles.evidenceText]} numberOfLines={2}>
                Symptom: {ticket.incident.symptomCategory}. Faculty attempted {ticket.incident.diagnosticSteps.length} structured checks prior to escalation.
              </Text>
            </View>

            <View style={styles.ticketFooter}>
              <Text style={[typography.caption, styles.ticketDate]}>
                Assigned: {formatDate(ticket.createdAt)}
              </Text>
              <Text style={[typography.button, styles.inspectLink]}>INSPECT &gt;</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  metricVal: {
    color: colors.textPrimary,
  },
  primaryActionCard: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionTitle: {
    color: colors.primaryText,
  },
  actionLink: {
    color: '#93C5FD',
    fontSize: 12,
  },
  actionDesc: {
    color: '#CBD5E1',
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
  },
  ticketCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ticketId: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  ticketDevice: {
    color: colors.textPrimary,
  },
  ticketLocation: {
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  evidenceSnippet: {
    backgroundColor: colors.surfaceSecondary,
    borderLeftWidth: 2,
    borderLeftColor: colors.borderDark,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  evidenceLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  evidenceText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  ticketDate: {
    color: colors.textMuted,
  },
  inspectLink: {
    color: colors.accent,
    fontSize: 12,
  },
});
