import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { TextInputField } from '../../../components/TextInputField';
import { Button } from '../../../components/Button';
import { LoadingView } from '../../../components/LoadingView';
import { Ticket } from '../../../types/ticket';
import { ticketService } from '../../../services/ticketService';

interface RepairNotesScreenProps {
  route: any;
  navigation: any;
}

export const RepairNotesScreen: React.FC<RepairNotesScreenProps> = ({
  route,
  navigation,
}) => {
  const ticketId: string = route.params?.ticketId || 'TCK-2026-042';
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [rootCause, setRootCause] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [partsRequired, setPartsRequired] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [photoCount, setPhotoCount] = useState<number>(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await ticketService.getTicketById(ticketId);
        if (data) {
          setTicket(data);
          setRootCause(data.rootCause || '');
          setWorkPerformed(data.workPerformed || '');
          setPartsRequired(data.partsRequired || '');
          setTechnicianNotes(data.technicianNotes || '');
          setPhotoCount(data.photoUris?.length || 0);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [ticketId]);

  if (isLoading || !ticket) {
    return <LoadingView message="LOADING REPAIR LOG..." />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await ticketService.updateRepairNotes(ticket.id, {
        rootCause: rootCause.trim(),
        workPerformed: workPerformed.trim(),
        partsRequired: partsRequired.trim(),
        technicianNotes: technicianNotes.trim(),
      });
      navigation.navigate('UpdateTicketStatus', { ticketId: ticket.id });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulatePhoto = () => {
    setPhotoCount(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="REPAIR NOTES & FINDINGS"
        subtitle={`TICKET: ${ticket.id}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Device Context */}
        <View style={styles.contextBox}>
          <Text style={[typography.caption, styles.contextLabel]}>HARDWARE UNDER REPAIR</Text>
          <Text style={[typography.h3, styles.contextDevice]}>{ticket.incident.deviceName}</Text>
          <Text style={[typography.caption, styles.contextLoc]}>
            ROOM: {ticket.incident.classroomName}
          </Text>
        </View>

        {/* Root Cause Input */}
        <TextInputField
          label="IDENTIFIED ROOT CAUSE"
          placeholder="e.g. Pin 19 on wall-plate HDMI female socket bent, causing EDID clock signal loss."
          value={rootCause}
          onChangeText={setRootCause}
          multiline
          numberOfLines={2}
          style={styles.textAreaSm}
        />

        {/* Work Performed Input */}
        <TextInputField
          label="WORK / REMEDIATION PERFORMED"
          placeholder="e.g. Replaced Keystone HDMI connector, re-terminated Cat6 HDBaseT receiver and verified 4K video handshake."
          value={workPerformed}
          onChangeText={setWorkPerformed}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {/* Parts Required (Optional) */}
        <TextInputField
          label="PARTS / REQUISITION REQUIRED (IF APPLICABLE)"
          placeholder="e.g. Part # EPS-L630-FLT (Replacement thermal exhaust filter)"
          value={partsRequired}
          onChangeText={setPartsRequired}
        />

        {/* Field Notes */}
        <TextInputField
          label="ADDITIONAL TECHNICIAN NOTES"
          placeholder="e.g. Advised faculty to use HDMI 1 port on podium."
          value={technicianNotes}
          onChangeText={setTechnicianNotes}
          multiline
          numberOfLines={2}
          style={styles.textAreaSm}
        />

        {/* Photo Attachment Section */}
        <View style={styles.photoCard}>
          <View style={styles.photoHeader}>
            <Text style={[typography.caption, styles.photoTitle]}>ATTACH REPAIR EVIDENCE PHOTOS</Text>
            <Text style={[typography.code, styles.photoCount]}>{photoCount} ATTACHED</Text>
          </View>
          <Button
            label="[ATTACH INSPECTION / REPAIR PHOTO]"
            onPress={handleSimulatePhoto}
            variant="outline"
            size="sm"
          />
        </View>

        {/* Action Buttons */}
        <Button
          label="[SAVE NOTES & PROCEED TO STATUS UPDATE]"
          onPress={handleSave}
          variant="primary"
          loading={isSaving}
          style={styles.saveBtn}
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
  contextBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  contextLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 2,
  },
  contextDevice: {
    color: colors.textPrimary,
  },
  contextLoc: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  textAreaSm: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  photoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  photoTitle: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  photoCount: {
    color: colors.textSecondary,
  },
  saveBtn: {
    marginBottom: spacing.xxl,
  },
});
