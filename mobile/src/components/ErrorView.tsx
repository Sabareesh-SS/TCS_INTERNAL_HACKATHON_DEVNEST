import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { Button } from './Button';

interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'SYSTEM ERROR',
  message,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.tag}>
          <Text style={[typography.badge, styles.tagText]}>[{title}]</Text>
        </View>
        <Text style={[typography.bodyMedium, styles.message]}>{message}</Text>
        {onRetry ? (
          <Button
            label="[RETRY OPERATION]"
            onPress={onRetry}
            variant="outline"
            size="sm"
            style={styles.btn}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.danger,
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  btn: {
    marginTop: spacing.xs,
    minWidth: 140,
  },
});
