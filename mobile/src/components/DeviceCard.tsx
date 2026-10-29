import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Device } from '../types/device';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { StatusBadge } from './StatusBadge';

interface DeviceCardProps {
  device: Device;
  onPress: () => void;
  showLocation?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, showLocation = false }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.typeBadge}>
          <Text style={[typography.badge, styles.typeText]}>
            {device.deviceType.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        <StatusBadge status={device.status} />
      </View>

      <Text style={[typography.h3, styles.title]} numberOfLines={1}>
        {device.manufacturer} {device.modelNumber}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[typography.code, styles.assetTag]}>TAG: {device.assetTag}</Text>
        {device.serialNumber ? (
          <Text style={[typography.caption, styles.metaText]}>S/N: {device.serialNumber}</Text>
        ) : null}
      </View>

      {showLocation && device.classroomName ? (
        <View style={styles.locationContainer}>
          <Text style={[typography.caption, styles.locationText]}>
            LOC: {device.classroomName}
          </Text>
        </View>
      ) : null}

      {device.quickGuideRef ? (
        <Text style={[typography.caption, styles.guideText]} numberOfLines={1}>
          {device.quickGuideRef}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={[typography.button, styles.inspectText]}>VIEW DETAILS &gt;</Text>
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
    marginBottom: spacing.sm,
  },
  typeBadge: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  typeText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  assetTag: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  metaText: {
    color: colors.textMuted,
  },
  locationContainer: {
    marginTop: spacing.xs,
  },
  locationText: {
    color: colors.textSecondary,
  },
  guideText: {
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  footerRow: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    alignItems: 'flex-end',
  },
  inspectText: {
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 0.3,
  },
});
