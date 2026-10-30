import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { IncidentCard } from '../../../components/IncidentCard';
import { useAuth } from '../../../hooks/useAuth';
import { useIncident } from '../../../hooks/useIncident';

interface FacultyHomeScreenProps {
  navigation: any;
}

export const FacultyHomeScreen: React.FC<FacultyHomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { incidents, isLoading } = useIncident(user?.id);

  const activeIncidents = incidents.filter(
    i => i.status === 'in_troubleshooting' || i.status === 'escalated_to_technician'
  );

  return (
    <View style={styles.container}>
      <HeaderBar
        title="FACULTY AV PORTAL"
        subtitle={user?.fullName ? `AUTHORIZED: ${user.fullName.toUpperCase()}` : 'FACULTY CONSOLE'}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Quick Launch Action Banner */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('QRScanner')}
          style={styles.primaryScanCard}
        >
          <View style={styles.scanBadge}>
            <Text style={[typography.badge, styles.scanBadgeText]}>PRIMARY ACTION</Text>
          </View>
          <Text style={[typography.h2, styles.scanTitle]}>[SCAN CLASSROOM OR DEVICE QR]</Text>
          <Text style={[typography.bodyMedium, styles.scanSubtitle]}>
            Point camera at podium QR plate or hardware asset label to load room equipment or start diagnostics immediately.
          </Text>
        </TouchableOpacity>

        {/* Secondary Direct Room Action */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ClassroomInventory', { classroomId: 'AB-105' })}
          style={styles.secondaryCard}
        >
          <View style={styles.secTopRow}>
            <Text style={[typography.h3, styles.secTitle]}>BROWSE ROOM INVENTORY</Text>
            <Text style={[typography.button, styles.secLink]}>SELECT ROOM &gt;</Text>
          </View>
          <Text style={[typography.bodySmall, styles.secDesc]}>
            Access registered projectors, microphones, and interactive displays across campus blocks without QR code.
          </Text>
        </TouchableOpacity>

        {/* Active Incidents Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.h3, styles.sectionTitle]}>ACTIVE AV INCIDENTS</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MyIncidents')}
          >
            <Text style={[typography.button, styles.viewAllText]}>VIEW ALL ({incidents.length})</Text>
          </TouchableOpacity>
        </View>

        {activeIncidents.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[typography.bodySmall, styles.emptyText]}>
              NO CURRENT FAULTS REPORTED BY YOUR ACCOUNT
            </Text>
          </View>
        ) : (
          activeIncidents.map(inc => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              onPress={() => navigation.navigate('IncidentDetails', { incidentId: inc.id })}
            />
          ))
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
  primaryScanCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  scanBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.sm,
  },
  scanBadgeText: {
    color: colors.primaryText,
    fontSize: 10,
  },
  scanTitle: {
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  scanSubtitle: {
    color: '#CBD5E1',
    lineHeight: 20,
  },
  secondaryCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  secTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  secTitle: {
    color: colors.textPrimary,
  },
  secLink: {
    color: colors.accent,
    fontSize: 12,
  },
  secDesc: {
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
  },
  viewAllText: {
    color: colors.accent,
    fontSize: 12,
  },
  emptyBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
