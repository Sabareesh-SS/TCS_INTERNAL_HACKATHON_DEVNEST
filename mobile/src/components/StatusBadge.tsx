import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', style }) => {
  const norm = (status || '').toLowerCase().replace(/_/g, ' ');

  let bg = colors.surfaceSecondary;
  let text = colors.textSecondary;
  let border = colors.border;
  let label = status.toUpperCase();

  switch (norm) {
    case 'operational':
    case 'resolved':
    case 'resolved by faculty':
    case 'active':
      bg = colors.status.resolvedBg;
      text = colors.status.resolvedText;
      border = colors.status.resolvedBorder;
      label = norm === 'resolved by faculty' ? 'RESOLVED (FACULTY)' : 'RESOLVED';
      if (norm === 'active') label = 'ACTIVE';
      if (norm === 'operational') label = 'OPERATIONAL';
      break;

    case 'in progress':
    case 'in troubleshooting':
      bg = colors.status.inProgressBg;
      text = colors.status.inProgressText;
      border = colors.status.inProgressBorder;
      label = norm === 'in troubleshooting' ? 'IN DIAGNOSTICS' : 'IN PROGRESS';
      break;

    case 'escalated':
    case 'escalated to technician':
    case 'faulty':
    case 'critical':
      bg = colors.status.escalatedBg;
      text = colors.status.escalatedText;
      border = colors.status.escalatedBorder;
      label = norm === 'escalated to technician' ? 'ESCALATED' : norm === 'faulty' ? 'FAULTY' : norm.toUpperCase();
      break;

    case 'awaiting parts':
      bg = colors.status.awaitingPartsBg;
      text = colors.status.awaitingPartsText;
      border = colors.status.awaitingBorder;
      label = 'AWAITING PARTS';
      break;

    case 'high':
      bg = colors.priority.highBg;
      text = colors.priority.highText;
      border = colors.priority.highBg;
      label = 'HIGH';
      break;

    case 'medium':
      bg = colors.priority.mediumBg;
      text = colors.priority.mediumText;
      border = colors.priority.mediumBg;
      label = 'MEDIUM';
      break;

    case 'low':
      bg = colors.priority.lowBg;
      text = colors.priority.lowText;
      border = colors.priority.lowBg;
      label = 'LOW';
      break;

    case 'unable to resolve':
      bg = colors.dangerBg;
      text = colors.danger;
      border = colors.border;
      label = 'UNABLE TO RESOLVE';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          typography.badge,
          {
            color: text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
        numberOfLines={1}
      >
        [{label}]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
