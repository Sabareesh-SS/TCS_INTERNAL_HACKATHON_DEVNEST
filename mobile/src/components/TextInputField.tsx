import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, layout, spacing } from '../theme/spacing';

export interface TextInputFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  containerStyle?: ViewStyle;
  style?: TextStyle | TextStyle[];
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  style,
  editable,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[typography.bodySmall, styles.label]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          typography.bodyMedium,
          {
            borderColor: error ? colors.danger : isFocused ? colors.borderDark : colors.border,
            backgroundColor: editable === false ? colors.surfaceSecondary : colors.card,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        onFocus={e => {
          setIsFocused(true);
          onFocus && onFocus(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        {...props}
      />
      {error ? (
        <Text style={[typography.caption, styles.errorText]}>{error}</Text>
      ) : helperText ? (
        <Text style={[typography.caption, styles.helperText]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  input: {
    height: layout.inputHeight,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
