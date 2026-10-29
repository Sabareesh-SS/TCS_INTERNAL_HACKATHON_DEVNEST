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
import { Device } from '../../../types/device';
import { deviceService } from '../../../services/deviceService';

interface DeviceDetailsScreenProps {
  route: any;
  navigation: any;
}

export const DeviceDetailsScreen: React.FC<DeviceDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const deviceId = route.params?.deviceId || 'DEV-PRJ-402';
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const d = await deviceService.getDeviceById(deviceId);
        if (!d) {
          setError(`Device with asset identifier "${deviceId}" was not found.`);
        } else {
          setDevice(d);
        }
      } catch (err: any) {
        setError(err?.message || 'Error loading device details.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [deviceId]);

  if (isLoading) return <LoadingView message="LOADING ASSET METRICS..." />;
  if (error || !device) {
    return <ErrorView message={error || 'Device not found'} onRetry={() => navigation.goBack()} />;
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title={device.assetTag}
        subtitle={`${device.manufacturer} ${device.deviceType.toUpperCase()}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Status & Model Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <Text style={[typography.badge, styles.typeBadgeText]}>
                {device.deviceType.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <StatusBadge status={device.status} />
          </View>

          <Text style={[typography.h2, styles.modelTitle]}>
            {device.manufacturer} {device.modelNumber}
          </Text>

          <View style={styles.divider} />

          <View style={styles.dataRow}>
            <Text style={[typography.caption, styles.label]}>ASSET TAG</Text>
            <Text style={[typography.code, styles.value]}>{device.assetTag}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={[typography.caption, styles.label]}>SERIAL NUMBER</Text>
            <Text style={[typography.code, styles.value]}>{device.serialNumber}</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={[typography.caption, styles.label]}>ROOM LOCATION</Text>
            <Text style={[typography.bodyMedium, styles.value]}>
              {device.classroomName || 'Room 402 - Ramanujan Block'}
            </Text>
          </View>

          {device.ipAddress ? (
            <View style={styles.dataRow}>
              <Text style={[typography.caption, styles.label]}>NETWORK IP</Text>
              <Text style={[typography.code, styles.value]}>{device.ipAddress}</Text>
            </View>
          ) : null}

          {device.installDate ? (
            <View style={styles.dataRow}>
              <Text style={[typography.caption, styles.label]}>COMMISSIONED</Text>
              <Text style={[typography.bodySmall, styles.value]}>{device.installDate}</Text>
            </View>
          ) : null}
        </View>

        {/* Documentation Reference Card */}
        {device.quickGuideRef ? (
          <View style={styles.docCard}>
            <Text style={[typography.caption, styles.docTitle]}>STANDARD DOCUMENTATION</Text>
            <Text style={[typography.bodyMedium, styles.docRef]}>{device.quickGuideRef}</Text>
          </View>
        ) : null}

        {/* Primary CTA: Report Fault & Start AI Diagnostics */}
        <Button
          label="[REPORT FAULT ON THIS EQUIPMENT]"
          onPress={() => navigation.navigate('ReportFault', { device })}
          variant="primary"
          style={styles.actionBtn}
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  badgeRow: {
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
  typeBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  modelTitle: {
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  value: {
    color: colors.textPrimary,
  },
  docCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  docTitle: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  docRef: {
    color: colors.textSecondary,
  },
  actionBtn: {
    marginBottom: spacing.xxl,
  },
});
