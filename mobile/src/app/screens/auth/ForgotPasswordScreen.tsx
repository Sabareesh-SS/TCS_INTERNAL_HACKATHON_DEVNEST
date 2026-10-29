import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { TextInputField } from '../../../components/TextInputField';
import { Button } from '../../../components/Button';
import { isValidEmail } from '../../../utils/validators';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setError('Please provide a valid registered institutional email address.');
      return;
    }
    setError(null);
    setIsSubmitted(true);
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="PASSWORD RESET"
        subtitle="Campus Account Recovery"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {isSubmitted ? (
          <View style={styles.successCard}>
            <View style={styles.tag}>
              <Text style={[typography.badge, styles.tagText]}>[INSTRUCTIONS DISPATCHED]</Text>
            </View>
            <Text style={[typography.h3, styles.successTitle]}>RESET LINK TRANSMITTED</Text>
            <Text style={[typography.bodyMedium, styles.successBody]}>
              If an authorized campus account exists for {email}, a cryptographically signed recovery token has been sent. Check your institutional inbox.
            </Text>
            <Button
              label="[RETURN TO SIGN IN]"
              onPress={() => navigation.goBack()}
              variant="primary"
              style={styles.returnBtn}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={[typography.bodyMedium, styles.infoText]}>
              Enter your registered campus email address. An automated identity verification token will be dispatched.
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={[typography.caption, styles.errorText]}>[ERROR: {error}]</Text>
              </View>
            ) : null}

            <TextInputField
              label="CAMPUS EMAIL"
              placeholder="e.g. yourname@campus.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              label="[DISPATCH RESET LINK]"
              onPress={handleSubmit}
              variant="primary"
              style={styles.btn}
            />
          </View>
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  infoText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
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
  btn: {
    marginTop: spacing.sm,
  },
  successCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.status.resolvedBorder,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.status.resolvedBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.status.resolvedText,
  },
  successTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successBody: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  returnBtn: {
    minWidth: 200,
  },
});
