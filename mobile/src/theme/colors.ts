/**
 * Color Palette - Minimalist Executive Enterprise Theme
 * Strictly zero emojis. Controlled contrast, professional slate/neutral base with functional status tones.
 */

export const colors = {
  // Surface & Canvas
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceSubtle: '#F8FAFC',

  // Hairline & Structural Borders
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderDark: '#0F172A',
  divider: '#EEF2F6',

  // Typography Tokens
  textPrimary: '#0F172A',     // Slate-900: High-contrast primary headers & values
  textSecondary: '#475569',   // Slate-600: Secondary labels, metadata, body text
  textMuted: '#94A3B8',       // Slate-400: Timestamps, hints, inactive states
  textInverse: '#FFFFFF',     // White on dark actions

  // Interactive Buttons & Brand
  primary: '#0F172A',         // High-authority deep slate for primary CTA
  primaryHover: '#1E293B',
  primaryText: '#FFFFFF',

  secondary: '#E2E8F0',
  secondaryText: '#0F172A',

  accent: '#2563EB',          // Clean royal blue for links and active tabs
  accentSubtle: '#EFF6FF',

  // Status & Priority Tones (High-contrast, professional, non-garish)
  status: {
    resolvedBg: '#DCFCE7',
    resolvedText: '#166534',
    resolvedBorder: '#BBF7D0',

    inProgressBg: '#FEF3C7',
    inProgressText: '#92400E',
    inProgressBorder: '#FDE68A',

    escalatedBg: '#FEE2E2',
    escalatedText: '#991B1B',
    escalatedBorder: '#FECACA',

    awaitingPartsBg: '#F1F5F9',
    awaitingPartsText: '#475569',
    awaitingBorder: '#CBD5E1',

    operationalBg: '#ECFDF5',
    operationalText: '#065F46',
    operationalBorder: '#A7F3D0',

    faultyBg: '#FEF2F2',
    faultyText: '#991B1B',
    faultyBorder: '#FECACA',
  },

  // Priority Tones
  priority: {
    criticalBg: '#991B1B',
    criticalText: '#FFFFFF',
    highBg: '#DC2626',
    highText: '#FFFFFF',
    mediumBg: '#D97706',
    mediumText: '#FFFFFF',
    lowBg: '#475569',
    lowText: '#FFFFFF',
  },

  // Feedback states
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  success: '#16A34A',
  successBg: '#F0FDF4',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  info: '#2563EB',
  infoBg: '#EFF6FF',
} as const;

export type Colors = typeof colors;
