import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { DiagnosticStepCard } from '../../../components/DiagnosticStepCard';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { Button } from '../../../components/Button';
import { Incident } from '../../../types/incident';
import { DiagnosticStep } from '../../../types/diagnostic';
import { incidentService } from '../../../services/incidentService';
import { diagnosticService } from '../../../services/diagnosticService';

interface AIDiagnosticScreenProps {
  route: any;
  navigation: any;
}

export const AIDiagnosticScreen: React.FC<AIDiagnosticScreenProps> = ({
  route,
  navigation,
}) => {
  const incidentId: string = route.params?.incidentId || 'INC-2026-001';

  const [incident, setIncident] = useState<Incident | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED'>('IN_PROGRESS');
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    async function loadIncident() {
      setIsLoading(true);
      try {
        const inc = await incidentService.getIncidentById(incidentId);
        if (inc) {
          setIncident(inc);
          // Resume where faculty left off if previous responses exist
          const completedCount = inc.diagnosticSteps.filter(s => s.facultyResponse).length;
          if (inc.status === 'resolved_by_faculty') {
            setOutcome('RESOLVED');
          } else if (inc.status === 'escalated_to_technician') {
            setOutcome('ESCALATED');
            setTicketId(inc.ticketId || null);
          } else {
            setCurrentStepIndex(Math.min(completedCount, inc.diagnosticSteps.length - 1));

            // Fetch live OEM benchmark RAG step from AI engine
            diagnosticService.fetchNextStepFromAI({
              incident_id: inc.id,
              device_id: inc.deviceId,
              device_type: inc.deviceType,
              symptom: inc.symptomCategory || inc.symptomDescription,
              power_status: inc.initialCheckPower ? 'ON' : 'OFF',
              cable_status: inc.initialCheckCable ? 'CONNECTED' : 'DISCONNECTED',
              step_number: 1,
            }).then(aiRes => {
              if (aiRes.step && inc.diagnosticSteps.length > 0) {
                inc.diagnosticSteps[0] = {
                  ...inc.diagnosticSteps[0],
                  actionTitle: aiRes.step.actionTitle,
                  instructionText: aiRes.step.instructionText,
                  manualReference: aiRes.step.manualReference || inc.diagnosticSteps[0].manualReference,
                  verificationPrompt: aiRes.step.verificationPrompt || inc.diagnosticSteps[0].verificationPrompt,
                };
                setIncident({ ...inc });
              }
            }).catch(() => {});
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadIncident();
  }, [incidentId]);

  if (isLoading || !incident) {
    return <LoadingView message="SYNCHRONIZING AI DIAGNOSTIC STATE..." />;
  }

  const steps: DiagnosticStep[] = incident.diagnosticSteps;
  const currentStep = steps[currentStepIndex];

  // Handler: Fix Worked
  const handleWorked = async () => {
    setIsProcessingAction(true);
    try {
      await incidentService.recordStepResponse(incident.id, currentStep.stepNumber, 'worked');
      await incidentService.resolveIncidentByFaculty(incident.id);

      // Notify AI Engine of resolution
      diagnosticService.fetchNextStepFromAI({
        incident_id: incident.id,
        device_id: incident.deviceId,
        device_type: incident.deviceType,
        symptom: incident.symptomCategory || incident.symptomDescription,
        previous_action_id: currentStep.actionTitle,
        previous_step_result: 'SUCCESS',
        step_number: currentStep.stepNumber,
      }).catch(() => {});

      setOutcome('RESOLVED');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: Did Not Work
  const handleDidNotWork = async () => {
    setIsProcessingAction(true);
    try {
      await incidentService.recordStepResponse(incident.id, currentStep.stepNumber, 'did_not_work');

      const nextStepNum = currentStep.stepNumber + 1;
      const aiResult = await diagnosticService.fetchNextStepFromAI({
        incident_id: incident.id,
        device_id: incident.deviceId,
        device_type: incident.deviceType,
        symptom: incident.symptomCategory || incident.symptomDescription,
        power_status: incident.initialCheckPower ? 'ON' : 'OFF',
        cable_status: incident.initialCheckCable ? 'CONNECTED' : 'DISCONNECTED',
        previous_action_id: currentStep.actionTitle,
        previous_step_result: 'FAILED',
        step_number: nextStepNum,
      });

      if (aiResult.status === 'ESCALATED' || aiResult.escalationRecommended) {
        const escalated = await incidentService.escalateToTechnician(incident.id, 'high');
        setTicketId(escalated?.ticketId || null);
        setOutcome('ESCALATED');
      } else {
        if (currentStepIndex + 1 < steps.length) {
          if (aiResult.step) {
            steps[currentStepIndex + 1] = {
              ...steps[currentStepIndex + 1],
              actionTitle: aiResult.step.actionTitle,
              instructionText: aiResult.step.instructionText,
              manualReference: aiResult.step.manualReference || steps[currentStepIndex + 1].manualReference,
              verificationPrompt: aiResult.step.verificationPrompt || steps[currentStepIndex + 1].verificationPrompt,
            };
          }
          setCurrentStepIndex(prev => prev + 1);
        } else {
          const escalated = await incidentService.escalateToTechnician(incident.id, 'high');
          setTicketId(escalated?.ticketId || null);
          setOutcome('ESCALATED');
        }
      }
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: Immediate Escalation
  const handleEscalateNow = async () => {
    setIsProcessingAction(true);
    try {
      await incidentService.recordStepResponse(incident.id, currentStep.stepNumber, 'skipped');
      const escalated = await incidentService.escalateToTechnician(incident.id, 'high');
      setTicketId(escalated?.ticketId || null);
      setOutcome('ESCALATED');
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="AI AV DIAGNOSTICS"
        subtitle={`INCIDENT: ${incident.id}`}
        onBack={() => navigation.navigate('FacultyHome')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Incident Context Header Box */}
        <View style={styles.contextCard}>
          <View style={styles.contextTopRow}>
            <Text style={[typography.caption, styles.contextTag]}>HARDWARE ASSET</Text>
            <Text style={[typography.caption, styles.contextLocation]}>
              {incident.classroomName}
            </Text>
          </View>
          <Text style={[typography.h3, styles.contextDevice]}>{incident.deviceName}</Text>
          <Text style={[typography.bodySmall, styles.contextSymptom]}>
            Observed Symptom: {incident.symptomCategory}
          </Text>
        </View>

        {/* State A: In Progress Structured Diagnostic Card */}
        {outcome === 'IN_PROGRESS' && currentStep && (
          <DiagnosticStepCard
            step={currentStep}
            onWorked={handleWorked}
            onDidNotWork={handleDidNotWork}
            onEscalate={handleEscalateNow}
            isLoading={isProcessingAction}
          />
        )}

        {/* State B: Resolved by Faculty */}
        {outcome === 'RESOLVED' && (
          <View style={styles.resolvedCard}>
            <View style={styles.resolvedBadge}>
              <Text style={[typography.badge, styles.resolvedBadgeText]}>
                [INCIDENT RESOLVED BY FACULTY]
              </Text>
            </View>

            <Text style={[typography.h2, styles.resolvedTitle]}>
              EQUIPMENT OPERATIONAL STATUS RESTORED
            </Text>

            <Text style={[typography.bodyMedium, styles.resolvedMessage]}>
              Diagnostic check confirmed successful. Hardware status for {incident.deviceName} has been restored to OPERATIONAL in the campus equipment registry.
            </Text>

            <View style={styles.outcomeDetailsBox}>
              <Text style={[typography.caption, styles.boxItem]}>
                INCIDENT REFERENCE: {incident.id}
              </Text>
              <Text style={[typography.caption, styles.boxItem]}>
                RESOLVED AT STEP: {currentStep ? currentStep.stepNumber : 1} OF {steps.length}
              </Text>
              <Text style={[typography.caption, styles.boxItem]}>
                ACTION APPLIED: {currentStep?.actionTitle}
              </Text>
            </View>

            <Button
              label="[RETURN TO FACULTY CONSOLE]"
              onPress={() => navigation.navigate('FacultyHome')}
              variant="primary"
              style={styles.doneBtn}
            />
          </View>
        )}

        {/* State C: Escalated to Technician */}
        {outcome === 'ESCALATED' && (
          <View style={styles.escalatedCard}>
            <View style={styles.escalatedBadge}>
              <Text style={[typography.badge, styles.escalatedBadgeText]}>
                [ESCALATED TO FIELD TECHNICIAN]
              </Text>
            </View>

            <Text style={[typography.h2, styles.escalatedTitle]}>
              DISPATCH TICKET CREATED
            </Text>

            <Text style={[typography.bodyMedium, styles.escalatedMessage]}>
              Self-troubleshooting steps could not restore service. A high-priority repair ticket has been assigned to campus AV engineering.
            </Text>

            <View style={styles.ticketDetailsBox}>
              <Text style={[typography.caption, styles.boxHeader]}>TECHNICIAN HANDOFF PACKAGE</Text>
              <Text style={[typography.bodyMedium, styles.ticketIdText]}>
                TICKET ID: {ticketId || 'TCK-2026-042'}
              </Text>
              <Text style={[typography.caption, styles.boxItem]}>
                PRIORITY: HIGH (CLASSROOM AV IN-USE)
              </Text>
              <Text style={[typography.caption, styles.boxItem]}>
                EVIDENCE ATTACHED: {steps.length} Diagnostic check attempts & physical verification logs.
              </Text>
              <Text style={[typography.caption, styles.boxItem]}>
                TECHNICIAN DISPATCHED: Alex Vance (Lead AV Engineer)
              </Text>
            </View>

            <Button
              label="[TRACK INCIDENT STATUS]"
              onPress={() => navigation.navigate('IncidentDetails', { incidentId: incident.id })}
              variant="primary"
              style={styles.doneBtn}
            />

            <Button
              label="[RETURN TO DASHBOARD]"
              onPress={() => navigation.navigate('FacultyHome')}
              variant="outline"
              style={styles.secDoneBtn}
            />
          </View>
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
  contextCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  contextTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  contextTag: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 10,
  },
  contextLocation: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  contextDevice: {
    color: colors.textPrimary,
    marginTop: 2,
  },
  contextSymptom: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  resolvedCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.status.resolvedBorder,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  resolvedBadge: {
    backgroundColor: colors.status.resolvedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.md,
  },
  resolvedBadgeText: {
    color: colors.status.resolvedText,
  },
  resolvedTitle: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  resolvedMessage: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  outcomeDetailsBox: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  boxItem: {
    color: colors.textSecondary,
  },
  doneBtn: {
    width: '100%',
  },
  secDoneBtn: {
    width: '100%',
    marginTop: spacing.sm,
  },
  escalatedCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.status.escalatedBorder,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  escalatedBadge: {
    backgroundColor: colors.status.escalatedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.md,
  },
  escalatedBadgeText: {
    color: colors.status.escalatedText,
  },
  escalatedTitle: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  escalatedMessage: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  ticketDetailsBox: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  boxHeader: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 10,
  },
  ticketIdText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
});
