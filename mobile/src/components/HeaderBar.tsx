import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightActionText?: string;
  onRightAction?: () => void;
  badgeText?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  onBack,
  rightActionText,
  onRightAction,
  badgeText,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.sm) + spacing.xs }]}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[typography.button, styles.backText]}>[BACK]</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {badgeText ? (
          <View style={styles.badgeContainer}>
            <Text style={[typography.badge, styles.badgeText]}>[{badgeText.toUpperCase()}]</Text>
          </View>
        ) : null}

        {rightActionText && onRightAction ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightAction}
            style={styles.rightAction}
          >
            <Text style={[typography.button, styles.rightActionText]}>{rightActionText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <Text style={[typography.h2, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[typography.bodySmall, styles.subtitle]} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  backButton: {
    paddingVertical: spacing.xs,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  placeholder: {
    width: 40,
  },
  badgeContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  rightAction: {
    paddingVertical: spacing.xs,
  },
  rightActionText: {
    color: colors.accent,
    fontSize: 13,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
});
