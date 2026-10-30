import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { Button } from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="USER PROFILE"
        subtitle="Institutional Identity & Authorization"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.card}>
          <View style={styles.roleTag}>
            <Text style={[typography.badge, styles.roleTagText]}>
              ROLE: {(role || 'unknown').toUpperCase()}
            </Text>
          </View>

          <Text style={[typography.h2, styles.userName]}>{user?.fullName || 'Authenticated User'}</Text>
          <Text style={[typography.bodyMedium, styles.userEmail]}>{user?.email}</Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={[typography.caption, styles.detailLabel]}>STAFF / FACULTY ID</Text>
            <Text style={[typography.code, styles.detailValue]}>{user?.staffId || 'NOT ASSIGNED'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[typography.caption, styles.detailLabel]}>DEPARTMENT</Text>
            <Text style={[typography.bodySmall, styles.detailValue]}>
              {user?.department || 'General Administration'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[typography.caption, styles.detailLabel]}>PHONE CONTACT</Text>
            <Text style={[typography.bodySmall, styles.detailValue]}>{user?.phone || 'N/A'}</Text>
          </View>
        </View>

        <Button
          label="[SIGN OUT OF ACCOUNT]"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutBtn}
          textStyle={{ color: colors.danger }}
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
  roleTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.xs,
  },
  roleTagText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  userName: {
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  userEmail: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  detailValue: {
    color: colors.textPrimary,
  },
  logoutBtn: {
    marginBottom: spacing.xxl,
  },
});
