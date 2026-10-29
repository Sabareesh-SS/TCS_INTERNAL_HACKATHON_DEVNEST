import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { TextInputField } from '../../../components/TextInputField';
import { Button } from '../../../components/Button';
import { SYMPTOMS_BY_DEVICE_TYPE } from '../../../utils/constants';
import { useAuth } from '../../../hooks/useAuth';
import { useIncident } from '../../../hooks/useIncident';
import { Device } from '../../../types/device';

interface ReportFaultScreenProps {
  route: any;
  navigation: any;
}

export const ReportFaultScreen: React.FC<ReportFaultScreenProps> = ({
  route,
  navigation,
}) => {
  const device: Device = route.params?.device || {
    id: 'DEV-PRJ-402',
    classroomId: 'CR-402',
    classroomName: 'Room 402 - Ramanujan Block',
    deviceType: 'projector',
    manufacturer: 'Epson',
    modelNumber: 'EB-L630U Laser Projector',
    assetTag: 'PRJ-402-A',
    serialNumber: 'EP-99482711-X',
    status: 'faulty',
  };

  const { user } = useAuth();
  const { reportFault } = useIncident();

  const availableSymptoms =
    SYMPTOMS_BY_DEVICE_TYPE[device.deviceType] || SYMPTOMS_BY_DEVICE_TYPE.projector;

  const [selectedSymptom, setSelectedSymptom] = useState(availableSymptoms[0]);
  const [description, setDescription] = useState('');
  const [powerCheck, setPowerCheck] = useState<boolean>(true);
  const [cableCheck, setCableCheck] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedSymptom) {
      setError('Please select a reported symptom category.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const newIncident = await reportFault({
        classroomId: device.classroomId,
        classroomName: device.classroomName || 'Room 402 - Ramanujan Block',
        deviceId: device.id,
        deviceName: `${device.manufacturer} ${device.modelNumber}`,
        deviceType: device.deviceType,
        reportedBy: user?.id || 'usr-fac-101',
        reportedByName: user?.fullName || 'Faculty Member',
        symptomCategory: selectedSymptom,
        symptomDescription: description.trim() || `Reported symptom: ${selectedSymptom}`,
        initialCheckPower: powerCheck,
        initialCheckCable: cableCheck,
      });

      // Advance directly to the AI Diagnostic Screen
      navigation.replace('AIDiagnostic', { incidentId: newIncident.id });
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize incident report.');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="REPORT FAULT"
        subtitle={`${device.assetTag} - ${device.manufacturer}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hardware Target Summary */}
        <View style={styles.targetCard}>
          <Text style={[typography.caption, styles.targetLabel]}>EQUIPMENT UNDER DIAGNOSIS</Text>
          <Text style={[typography.h3, styles.targetTitle]}>
            {device.manufacturer} {device.modelNumber}
          </Text>
          <Text style={[typography.caption, styles.targetLoc]}>
            {device.classroomName || 'Room 402'} (TAG: {device.assetTag})
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={[typography.caption, styles.errorText]}>[ERROR: {error}]</Text>
          </View>
        ) : null}

        {/* Symptom Selection */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>PRIMARY OBSERVED SYMPTOM</Text>
          <Text style={[typography.bodySmall, styles.sectionDesc]}>
            Select the most accurate hardware behavior observed:
          </Text>

          <View style={styles.symptomList}>
            {availableSymptoms.map(sym => {
              const isSelected = selectedSymptom === sym;
              return (
                <TouchableOpacity
                  key={sym}
                  activeOpacity={0.7}
                  onPress={() => setSelectedSymptom(sym)}
                  style={[
                    styles.symptomItem,
                    isSelected && styles.symptomItemSelected,
                  ]}
                >
                  <View style={styles.radioIndicator}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      typography.bodyMedium,
                      isSelected ? styles.symptomTextSelected : styles.symptomText,
                    ]}
                  >
                    {sym}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Initial Fast Diagnostic Checks */}
        <View style={styles.section}>
          <Text style={[typography.h4, styles.sectionTitle]}>INITIAL HARDWARE STATUS CHECKS</Text>

          {/* Check 1 */}
          <View style={styles.checkCard}>
            <Text style={[typography.bodyMedium, styles.checkLabel]}>
              1. Is the equipment power indicator LED illuminated?
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setPowerCheck(true)}
                style={[styles.toggleBtn, powerCheck && styles.toggleBtnActive]}
              >
                <Text style={[typography.button, powerCheck ? styles.toggleTextActive : styles.toggleText]}>
                  [YES: ON]
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPowerCheck(false)}
                style={[styles.toggleBtn, !powerCheck && styles.toggleBtnActive]}
              >
                <Text style={[typography.button, !powerCheck ? styles.toggleTextActive : styles.toggleText]}>
                  [NO: DARK / UNPOWERED]
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Check 2 */}
          <View style={styles.checkCard}>
            <Text style={[typography.bodyMedium, styles.checkLabel]}>
              2. Is the signal cable (HDMI/USB) securely seated in the podium plate?
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setCableCheck(true)}
                style={[styles.toggleBtn, cableCheck && styles.toggleBtnActive]}
              >
                <Text style={[typography.button, cableCheck ? styles.toggleTextActive : styles.toggleText]}>
                  [YES: CONNECTED]
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCableCheck(false)}
                style={[styles.toggleBtn, !cableCheck && styles.toggleBtnActive]}
              >
                <Text style={[typography.button, !cableCheck ? styles.toggleTextActive : styles.toggleText]}>
                  [NO: LOOSE / MISSING]
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Additional Observations */}
        <TextInputField
          label="ADDITIONAL SYMPTOM NOTES (OPTIONAL)"
          placeholder="e.g. Occurred 10 minutes into presentation when switching laptop..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        {/* Submit Button */}
        <Button
          label="[INITIALIZE AI DIAGNOSTIC ENGINE]"
          onPress={handleSubmit}
          variant="primary"
          loading={isSubmitting}
          style={styles.submitBtn}
        />
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
  targetCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  targetLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  targetTitle: {
    color: colors.textPrimary,
  },
  targetLoc: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.sm,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sectionDesc: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  symptomList: {
    gap: spacing.xs,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  symptomItemSelected: {
    borderColor: colors.borderDark,
    backgroundColor: colors.surfaceSubtle,
  },
  radioIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  symptomText: {
    color: colors.textSecondary,
    flex: 1,
  },
  symptomTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  checkCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkLabel: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  toggleTextActive: {
    color: colors.primaryText,
    fontSize: 11,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  submitBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
});
