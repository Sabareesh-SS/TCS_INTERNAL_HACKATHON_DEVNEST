import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Headings
  h1: {
    fontFamily,
    fontSize: 26,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Body Styles
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  },

  // Data & Micro Labels
  code: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
  badge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  button: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 14,
  },
} as const;

export type Typography = typeof typography;
