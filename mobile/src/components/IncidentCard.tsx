import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Incident } from '../types/incident';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/validators';

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[typography.code, styles.incidentId]}>{incident.id}</Text>
        <StatusBadge status={incident.status} />
      </View>

      <Text style={[typography.h3, styles.deviceTitle]} numberOfLines={1}>
        {incident.deviceName}
      </Text>

      <View style={styles.locationRow}>
        <Text style={[typography.bodySmall, styles.locationText]}>
          ROOM: {incident.classroomName}
        </Text>
      </View>

      <View style={styles.symptomBox}>
        <Text style={[typography.caption, styles.symptomLabel]}>REPORTED SYMPTOM</Text>
        <Text style={[typography.bodyMedium, styles.symptomText]} numberOfLines={2}>
          {incident.symptomCategory}: {incident.symptomDescription}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={[typography.caption, styles.dateText]}>
          {formatDate(incident.createdAt)}
        </Text>
        <Text style={[typography.button, styles.viewText]}>VIEW DETAILS &gt;</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  incidentId: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  deviceTitle: {
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  locationRow: {
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  locationText: {
    color: colors.textSecondary,
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
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  symptomText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  dateText: {
    color: colors.textMuted,
  },
  viewText: {
    color: colors.accent,
    fontSize: 12,
  },
});
