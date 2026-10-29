import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { Button } from '../../../components/Button';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { Ticket } from '../../../types/ticket';
import { ticketService } from '../../../services/ticketService';
import { formatDate } from '../../../utils/validators';

interface TicketDetailsScreenProps {
  route: any;
  navigation: any;
}

export const TicketDetailsScreen: React.FC<TicketDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const ticketId: string = route.params?.ticketId || 'TCK-2026-042';
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTicket = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getTicketById(ticketId);
      setTicket(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  if (isLoading || !ticket) {
    return <LoadingView message="LOADING TICKET EVIDENCE & WORKFLOW..." />;
  }

  const handleAcceptTicket = async () => {
    await ticketService.updateTicketStatus(ticket.id, 'in_progress');
    await loadTicket();
  };

  const completedChecksCount = ticket.checklist.filter(c => c.isCompleted).length;

  return (
    <View style={styles.container}>
      <HeaderBar
        title={ticket.id}
        subtitle={ticket.incident.classroomName}
        onBack={() => navigation.goBack()}
        badgeText={ticket.status.toUpperCase()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Ticket Overview Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={[typography.caption, styles.metaLabel]}>PRIORITY / STATUS</Text>
            <View style={styles.badges}>
              <StatusBadge status={ticket.priority} size="sm" />
              <StatusBadge status={ticket.status} size="sm" />
            </View>
          </View>

          <Text style={[typography.h2, styles.deviceTitle]}>
            {ticket.incident.deviceName}
          </Text>
          <Text style={[typography.bodyMedium, styles.locationText]}>
            FACILITY: {ticket.incident.classroomName}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>REPORTED BY FACULTY</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>
              {ticket.incident.reportedByName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>ASSIGNED TECHNICIAN</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>
              {ticket.assignedTechnicianName || 'Unassigned'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>CREATED TIMESTAMP</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>
              {formatDate(ticket.createdAt)}
            </Text>
          </View>

          <View style={styles.symptomBox}>
            <Text style={[typography.caption, styles.symptomLabel]}>SYMPTOM REPORT</Text>
            <Text style={[typography.bodyMedium, styles.symptomText]}>
              {ticket.incident.symptomCategory}: {ticket.incident.symptomDescription}
            </Text>
          </View>
        </View>

        {/* CRITICAL FEATURE: AI Diagnostic Evidence (Checks Already Completed by Faculty) */}
        <View style={styles.evidenceSection}>
          <View style={styles.evidenceHeader}>
            <Text style={[typography.h3, styles.sectionTitle]}>
              PRE-INSPECTION EVIDENCE & DIAGNOSTICS
            </Text>
            <Text style={[typography.caption, styles.noRepeatTag]}>
              DO NOT REPEAT VERIFIED CHECKS
            </Text>
          </View>

          <Text style={[typography.bodySmall, styles.sectionDesc]}>
            The following physical checks and manual tests were already executed and verified by faculty prior to escalation:
          </Text>

          {ticket.incident.diagnosticSteps.map(step => (
            <View key={step.id} style={styles.stepEvidenceCard}>
              <View style={styles.stepEvidenceTop}>
                <Text style={[typography.badge, styles.stepNum]}>STEP {step.stepNumber}</Text>
                <Text
                  style={[
                    typography.badge,
                    step.facultyResponse === 'did_not_work'
                      ? styles.failedTag
                      : styles.workedTag,
                  ]}
                >
                  [{step.facultyResponse ? step.facultyResponse.toUpperCase().replace('_', ' ') : 'NOT TESTED'}]
                </Text>
              </View>

              <Text style={[typography.h4, styles.stepTitle]}>{step.actionTitle}</Text>
              <Text style={[typography.bodySmall, styles.stepInstruction]}>
                {step.instructionText}
              </Text>

              {step.manualReference && (
                <Text style={[typography.caption, styles.manualCitation]}>
                  Manual Reference: {step.manualReference}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Workflow Actions */}
        <View style={styles.workflowSection}>
          <Text style={[typography.h3, styles.sectionTitle]}>REPAIR WORKFLOW ACTIONS</Text>

          {ticket.status === 'assigned' && (
            <Button
              label="[ACCEPT TICKET & START INSPECTION]"
              onPress={handleAcceptTicket}
              variant="primary"
              style={styles.actionBtn}
            />
          )}

          <Button
            label={`[TECHNICIAN REPAIR CHECKLIST (${completedChecksCount}/${ticket.checklist.length} COMPLETE)]`}
            onPress={() => navigation.navigate('RepairChecklist', { ticketId: ticket.id })}
            variant="outline"
            style={styles.actionBtn}
          />

          <Button
            label="[RECORD FINDINGS & WORK PERFORMED]"
            onPress={() => navigation.navigate('RepairNotes', { ticketId: ticket.id })}
            variant="outline"
            style={styles.actionBtn}
          />

          <Button
            label="[UPDATE TICKET STATUS / RESOLUTION]"
            onPress={() => navigation.navigate('UpdateTicketStatus', { ticketId: ticket.id })}
            variant="secondary"
            style={styles.actionBtn}
          />
        </View>
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  deviceTitle: {
    color: colors.textPrimary,
  },
  locationText: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  infoValue: {
    color: colors.textPrimary,
  },
  symptomBox: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  symptomLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  symptomText: {
    color: colors.textPrimary,
  },
  evidenceSection: {
    marginBottom: spacing.xl,
  },
  evidenceHeader: {
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
  },
  noRepeatTag: {
    color: colors.status.escalatedText,
    fontWeight: '700',
    fontSize: 10,
    marginTop: 2,
  },
  sectionDesc: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  stepEvidenceCard: {
    backgroundColor: colors.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.borderDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  stepEvidenceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stepNum: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  failedTag: {
    color: colors.status.escalatedText,
    fontSize: 10,
  },
  workedTag: {
    color: colors.status.resolvedText,
    fontSize: 10,
  },
  stepTitle: {
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stepInstruction: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  manualCitation: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  workflowSection: {
    marginBottom: spacing.xxl,
  },
  actionBtn: {
    marginBottom: spacing.sm,
  },
});
