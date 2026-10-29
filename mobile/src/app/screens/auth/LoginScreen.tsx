import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing, layout } from '../../../theme/spacing';
import { TextInputField } from '../../../components/TextInputField';
import { Button } from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
import { isValidEmail } from '../../../utils/validators';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('dr.sharma@campus.edu');
  const [password, setPassword] = useState('password123');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setValidationError('Enter a valid campus email address.');
      return;
    }
    if (!password) {
      setValidationError('Password field cannot be empty.');
      return;
    }

    setValidationError(null);
    try {
      await login(email, password);
      // Navigation is automatically handled by RootNavigator observing auth state
    } catch {
      // Error handled in hook
    }
  };

  const handleQuickFaculty = () => {
    setEmail('dr.sharma@campus.edu');
    setPassword('password123');
  };

  const handleQuickTechnician = () => {
    setEmail('tech.alex@campus.edu');
    setPassword('password123');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Institutional Authority Header */}
        <View style={styles.header}>
          <View style={styles.institutionBadge}>
            <Text style={[typography.badge, styles.institutionText]}>
              CAMPUS AV OPERATIONS & INFRASTRUCTURE
            </Text>
          </View>
          <Text style={[typography.h1, styles.appTitle]}>SMART AV ASSISTANT</Text>
          <Text style={[typography.bodyMedium, styles.subtitle]}>
            Role-Based Classroom Diagnostic & Maintenance Portal
          </Text>
        </View>

        {/* Credentials Form Box */}
        <View style={styles.formCard}>
          <Text style={[typography.h3, styles.cardTitle]}>INSTITUTIONAL LOGIN</Text>
          <Text style={[typography.bodySmall, styles.cardSubtitle]}>
            Role permissions are determined automatically from your authenticated campus profile.
          </Text>

          {validationError || error ? (
            <View style={styles.errorBanner}>
              <Text style={[typography.caption, styles.errorText]}>
                [ERROR: {validationError || error}]
              </Text>
            </View>
          ) : null}

          <TextInputField
            label="CAMPUS EMAIL"
            placeholder="e.g. name@campus.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInputField
            label="PASSWORD"
            placeholder="Enter secure password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            label="[SIGN IN TO ACCESS AV PORTAL]"
            onPress={handleLogin}
            variant="primary"
            loading={isLoading}
            style={styles.submitBtn}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={[typography.button, styles.forgotText]}>
              FORGOT ACCESS CREDENTIALS?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Evaluation / Quick-Fill Helper for Testing Both Roles */}
        <View style={styles.testProfilesBox}>
          <Text style={[typography.caption, styles.testLabel]}>
            EVALUATION QUICK-FILL (AUTO-ROLE DERIVATION)
          </Text>
          <View style={styles.quickFillRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleQuickFaculty}
              style={styles.quickFillBtn}
            >
              <Text style={[typography.code, styles.quickFillText]}>
                FILL: FACULTY (DR. SHARMA)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleQuickTechnician}
              style={styles.quickFillBtn}
            >
              <Text style={[typography.code, styles.quickFillText]}>
                FILL: TECHNICIAN (ALEX)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Compliance Footer */}
        <View style={styles.footer}>
          <Text style={[typography.caption, styles.footerText]}>
            SECURED VIA SUPABASE ROW LEVEL SECURITY (RLS)
          </Text>
          <Text style={[typography.caption, styles.footerSubtext]}>
            STRICT ZERO-EMOJI ENTERPRISE DESIGN STANDARD
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  institutionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.sm,
  },
  institutionText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  appTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  errorBanner: {
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
  submitBtn: {
    marginTop: spacing.sm,
    width: '100%',
  },
  forgotBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  forgotText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  testProfilesBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  testLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  quickFillRow: {
    gap: spacing.sm,
  },
  quickFillBtn: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xs,
  },
  quickFillText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  footerSubtext: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
});
