export const Colors = {
  primary: '#1B4F8A',
  primaryDark: '#0F3460',
  primaryLight: '#2D6BC4',
  primaryPale: '#EBF2FF',

  gold: '#F59E0B',
  goldLight: '#FDE68A',
  goldDark: '#D97706',

  background: '#EEF2F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',

  textPrimary: '#0F1C35',
  textSecondary: '#5A6A85',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  hadir: '#059669',
  hadirBg: '#D1FAE5',
  hadirText: '#065F46',

  terlambat: '#D97706',
  terlambatBg: '#FEF3C7',
  terlambatText: '#92400E',

  alpha: '#DC2626',
  alphaBg: '#FEE2E2',
  alphaText: '#991B1B',

  izin: '#2563EB',
  izinBg: '#DBEAFE',
  izinText: '#1E3A8A',

  sakit: '#7C3AED',
  sakitBg: '#EDE9FE',
  sakitText: '#4C1D95',

  border: '#E2E8F0',
  divider: '#F1F5F9',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 28,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B4F8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1B4F8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
