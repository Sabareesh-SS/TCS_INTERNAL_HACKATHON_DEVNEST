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
  const hasTopRow = Boolean(onBack || badgeText);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.sm) + spacing.xs }]}>
      {hasTopRow ? (
        <View style={styles.topRow}>
          {onBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[typography.button, styles.backText]}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}

          {badgeText ? (
            <View style={styles.badgeContainer}>
              <Text style={[typography.badge, styles.badgeText]}>{badgeText.toUpperCase()}</Text>
            </View>
          ) : null}

          <View style={styles.placeholder} />
        </View>
      ) : null}

      <View style={styles.titleRow}>
        <Text style={[typography.h2, styles.title, { flex: 1 }]} numberOfLines={1}>
          {title}
        </Text>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
