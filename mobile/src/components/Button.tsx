import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, layout, spacing } from '../theme/spacing';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  let btnBg: string = colors.primary;
  let btnBorder: string = colors.primary;
  let txtColor: string = colors.primaryText;

  switch (variant) {
    case 'secondary':
      btnBg = colors.surfaceSecondary;
      btnBorder = colors.border;
      txtColor = colors.textPrimary;
      break;
    case 'outline':
      btnBg = 'transparent';
      btnBorder = colors.borderStrong;
      txtColor = colors.textPrimary;
      break;
    case 'danger':
      btnBg = colors.danger;
      btnBorder = colors.danger;
      txtColor = colors.textInverse;
      break;
    case 'ghost':
      btnBg = 'transparent';
      btnBorder = 'transparent';
      txtColor = colors.textSecondary;
      break;
    default:
      btnBg = colors.primary;
      btnBorder = colors.primary;
      txtColor = colors.primaryText;
      break;
  }

  const height =
    size === 'sm' ? layout.buttonHeightSm : size === 'lg' ? 52 : layout.buttonHeight;
  const paddingHoriz = size === 'sm' ? spacing.md : spacing.lg;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.surfaceSecondary : btnBg,
          borderColor: disabled ? colors.border : btnBorder,
          height,
          paddingHorizontal: paddingHoriz,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.textPrimary}
        />
      ) : (
        <Text
          style={[
            typography.button,
            {
              color: disabled ? colors.textMuted : txtColor,
              fontSize: size === 'sm' ? 12 : 14,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
