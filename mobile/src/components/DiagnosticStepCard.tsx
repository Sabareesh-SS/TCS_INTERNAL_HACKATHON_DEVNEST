import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiagnosticStep } from '../types/diagnostic';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { Button } from './Button';

interface DiagnosticStepCardProps {
  step: DiagnosticStep;
  onWorked: () => void;
  onDidNotWork: () => void;
  onEscalate: () => void;
  isLoading?: boolean;
}

export const DiagnosticStepCard: React.FC<DiagnosticStepCardProps> = ({
  step,
  onWorked,
  onDidNotWork,
  onEscalate,
  isLoading = false,
}) => {
  return (
    <View style={styles.card}>
      {/* Step Indicator Header */}
      <View style={styles.headerRow}>
        <View style={styles.stepBadge}>
          <Text style={[typography.badge, styles.stepBadgeText]}>
            STEP {step.stepNumber} OF {step.totalSteps}
          </Text>
        </View>
        <Text style={[typography.caption, styles.aiTag]}>STRUCTURED AI ACTION</Text>
      </View>

      {/* Action Directive Title */}
      <Text style={[typography.h2, styles.actionTitle]}>{step.actionTitle}</Text>

      {/* Instruction Detail Box */}
      <View style={styles.instructionBox}>
        <Text style={[typography.caption, styles.boxLabel]}>PHYSICAL PROCEDURE</Text>
        <Text style={[typography.bodyLarge, styles.instructionText]}>
          {step.instructionText}
        </Text>
      </View>

      {/* Verification Prompt */}
      <View style={styles.verificationBox}>
        <Text style={[typography.caption, styles.verificationLabel]}>VERIFICATION QUESTION</Text>
        <Text style={[typography.bodyMedium, styles.verificationPrompt]}>
          {step.verificationPrompt}
        </Text>
      </View>

      {/* Manual Citation */}
      {step.manualReference ? (
        <View style={styles.citationBox}>
          <Text style={[typography.caption, styles.citationLabel]}>MANUAL CITATION</Text>
          <Text style={[typography.code, styles.citationText]}>{step.manualReference}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <Button
          label="[YES: THIS RESOLVED THE ISSUE]"
          onPress={onWorked}
          variant="primary"
          loading={isLoading}
          style={styles.actionBtn}
        />

        <Button
          label="[NO: DID NOT WORK - NEXT STEP]"
          onPress={onDidNotWork}
          variant="outline"
          disabled={isLoading}
          style={styles.actionBtn}
        />

        <Button
          label="[CANNOT PERFORM / ESCALATE TO TECHNICIAN]"
          onPress={onEscalate}
          variant="ghost"
          disabled={isLoading}
          textStyle={styles.escalateText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepBadge: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  stepBadgeText: {
    color: colors.textPrimary,
    fontSize: 11,
  },
  aiTag: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  actionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  instructionBox: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  boxLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  instructionText: {
    color: colors.textPrimary,
    lineHeight: 22,
  },
  verificationBox: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  verificationLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  verificationPrompt: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  citationBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.textSecondary,
    paddingLeft: spacing.sm,
    marginBottom: spacing.lg,
  },
  citationLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  citationText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  buttonGroup: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    width: '100%',
  },
  escalateText: {
    color: colors.danger,
    fontSize: 12,
  },
});
