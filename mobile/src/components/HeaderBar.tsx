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
      <View style={styles.titleRow}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[typography.button, styles.backText]}>← Back</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={[typography.h2, styles.title, { flex: 1 }]} numberOfLines={1}>
          {title}
        </Text>

        {badgeText ? (
          <View style={styles.badgeContainer}>
            <Text style={[typography.badge, styles.badgeText]}>{badgeText.toUpperCase()}</Text>
          </View>
        ) : null}

        {rightActionText && onRightAction ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightAction}
            style={styles.rightAction}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[typography.button, styles.rightActionText]}>{rightActionText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    justifyContent: 'center',
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  badgeContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 2,
    marginLeft: spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  title: {
    color: colors.textPrimary,
  },
  rightAction: {
    paddingVertical: spacing.xs,
    paddingLeft: spacing.sm,
  },
  rightActionText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 2,
  },
});
