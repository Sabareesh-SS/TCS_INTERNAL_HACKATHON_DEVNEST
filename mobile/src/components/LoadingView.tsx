import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ message = 'PROCESSING DATA...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.textPrimary} />
      <Text style={[typography.caption, styles.text]}>{message.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  text: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    letterSpacing: 0.5,
  },
});
