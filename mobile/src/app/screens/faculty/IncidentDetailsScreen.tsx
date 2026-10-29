import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { Button } from '../../../components/Button';
import { Incident } from '../../../types/incident';
import { incidentService } from '../../../services/incidentService';
import { formatDate } from '../../../utils/validators';

interface IncidentDetailsScreenProps {
  route: any;
  navigation: any;
}

export const IncidentDetailsScreen: React.FC<IncidentDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const incidentId: string = route.params?.incidentId || 'INC-2026-081';
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const item = await incidentService.getIncidentById(incidentId);
        setIncident(item);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [incidentId]);

  if (isLoading || !incident) {
    return <LoadingView message="LOADING INCIDENT RECORD..." />;
  }

  const isOngoing = incident.status === 'in_troubleshooting';

  return (
    <View style={styles.container}>
      <HeaderBar
        title={incident.id}
        subtitle={incident.classroomName}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status & Summary */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={[typography.caption, styles.metaLabel]}>CURRENT STATUS</Text>
            <StatusBadge status={incident.status} />
          </View>

          <Text style={[typography.h2, styles.deviceTitle]}>{incident.deviceName}</Text>
          <Text style={[typography.bodyMedium, styles.locationText]}>
            ROOM: {incident.classroomName}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>REPORTED BY</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>{incident.reportedByName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>REPORTED AT</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>
              {formatDate(incident.createdAt)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[typography.caption, styles.infoLabel]}>SYMPTOM CATEGORY</Text>
            <Text style={[typography.bodySmall, styles.infoValue]}>{incident.symptomCategory}</Text>
          </View>

          <View style={styles.symptomBox}>
            <Text style={[typography.caption, styles.symptomLabel]}>DESCRIPTION</Text>
            <Text style={[typography.bodyMedium, styles.symptomText]}>
              {incident.symptomDescription}
            </Text>
          </View>

          {incident.ticketId && (
            <View style={styles.ticketBanner}>
              <Text style={[typography.caption, styles.ticketLabel]}>TECHNICIAN DISPATCH TICKET</Text>
              <Text style={[typography.bodyMedium, styles.ticketId]}>
                TICKET REF: {incident.ticketId}
              </Text>
              <Text style={[typography.caption, styles.ticketStatus]}>
                STATUS: ASSIGNED TO FIELD TECHNICIAN
              </Text>
            </View>
          )}
        </View>

        {/* Diagnostic Steps History (Handoff Evidence) */}
        <View style={styles.stepsSection}>
          <Text style={[typography.h3, styles.sectionTitle]}>
            TROUBLESHOOTING AUDIT & EVIDENCE LOG
          </Text>
          <Text style={[typography.bodySmall, styles.sectionDesc]}>
            Chronological records of structured checks performed by faculty:
          </Text>

          {incident.diagnosticSteps.map((step, idx) => {
            const hasResponse = !!step.facultyResponse;
            return (
              <View key={step.id || idx} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <Text style={[typography.badge, styles.stepIndex]}>
                    STEP {step.stepNumber}
                  </Text>
                  <Text
                    style={[
                      typography.badge,
                      step.facultyResponse === 'worked'
                        ? styles.responseWorked
                        : step.facultyResponse === 'did_not_work'
                        ? styles.responseFailed
                        : styles.responseSkipped,
                    ]}
                  >
                    [{hasResponse ? step.facultyResponse?.toUpperCase().replace(/_/g, ' ') : 'NOT ATTEMPTED'}]
                  </Text>
                </View>

                <Text style={[typography.h4, styles.stepTitle]}>{step.actionTitle}</Text>
                <Text style={[typography.bodySmall, styles.stepInstruction]}>
                  {step.instructionText}
                </Text>

                {step.manualReference && (
                  <Text style={[typography.caption, styles.manualRef]}>
                    Citation: {step.manualReference}
                  </Text>
                )}

                {step.responseTimestamp && (
                  <Text style={[typography.caption, styles.timestamp]}>
                    Recorded: {formatDate(step.responseTimestamp)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* If still in troubleshooting, option to resume */}
        {isOngoing && (
          <Button
            label="[RESUME AI TROUBLESHOOTING]"
            onPress={() => navigation.navigate('AIDiagnostic', { incidentId: incident.id })}
            variant="primary"
            style={styles.resumeBtn}
          />
        )}
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
  ticketBanner: {
    backgroundColor: colors.surfaceSubtle,
    borderLeftWidth: 3,
    borderLeftColor: colors.status.escalatedText,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  ticketLabel: {
    color: colors.status.escalatedText,
    fontWeight: '700',
  },
  ticketId: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  ticketStatus: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stepIndex: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  responseWorked: {
    color: colors.status.resolvedText,
    fontSize: 10,
  },
  responseFailed: {
    color: colors.status.escalatedText,
    fontSize: 10,
  },
  responseSkipped: {
    color: colors.textMuted,
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
  manualRef: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  timestamp: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  resumeBtn: {
    marginBottom: spacing.xl,
  },
});
