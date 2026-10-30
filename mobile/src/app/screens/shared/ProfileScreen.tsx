import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
  const { user, role, logout, switchRole } = useAuth();

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

        {/* Prototype Role Switcher Card for Seamless Evaluation */}
        <View style={styles.switchCard}>
          <Text style={[typography.h4, styles.switchTitle]}>EVALUATION ROLE OVERRIDE</Text>
          <Text style={[typography.bodySmall, styles.switchDesc]}>
            Toggle between Faculty and Technician stacks instantly to evaluate role-specific screens and permissions.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => switchRole('faculty')}
              style={[
                styles.roleBtn,
                role === 'faculty' && styles.roleBtnActive,
              ]}
            >
              <Text
                style={[
                  typography.button,
                  role === 'faculty' ? styles.roleTextActive : styles.roleTextInactive,
                ]}
              >
                [FACULTY ROLE]
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => switchRole('technician')}
              style={[
                styles.roleBtn,
                role === 'technician' && styles.roleBtnActive,
              ]}
            >
              <Text
                style={[
                  typography.button,
                  role === 'technician' ? styles.roleTextActive : styles.roleTextInactive,
                ]}
              >
                [TECHNICIAN ROLE]
              </Text>
            </TouchableOpacity>
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
  switchCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  switchTitle: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  switchDesc: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  roleBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleTextActive: {
    color: colors.textInverse,
    fontSize: 12,
  },
  roleTextInactive: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  logoutBtn: {
    marginBottom: spacing.xxl,
  },
});
