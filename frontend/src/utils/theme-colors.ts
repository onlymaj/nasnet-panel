import { useMemo } from 'react';
import { useAppTheme } from '../state/ThemeContext';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryStrong: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
  fontSizes: { xs: string; sm: string; md: string; lg: string; xl: string };
  fontWeights: { regular: number; medium: number; semibold: number; bold: number };
}

const DARK: ThemeColors = {
  background: '#0a0a0a',
  surface: '#141414',
  surfaceAlt: '#1c1c1c',
  border: '#262626',
  borderStrong: '#3a3a3a',
  text: '#f5f5f5',
  textMuted: '#a1a1aa',
  primary: '#f8fafc',
  primaryStrong: '#e2e8f0',
  danger: '#ef4444',
  success: '#22C55E',
  warning: '#edc32c',
  info: '#3b82f6',
  fontSizes: { xs: '11px', sm: '13px', md: '14px', lg: '16px', xl: '20px' },
  fontWeights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
};

const LIGHT: ThemeColors = {
  background: '#f1f5f9',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  border: '#dbe3ed',
  borderStrong: '#c2ccd9',
  text: '#0f172a',
  textMuted: '#64748b',
  primary: '#0f172a',
  primaryStrong: '#1e293b',
  danger: '#dc2626',
  success: '#22C55E',
  warning: '#edc32c',
  info: '#2563eb',
  fontSizes: DARK.fontSizes,
  fontWeights: DARK.fontWeights,
};

export function useThemeColors(): ThemeColors {
  const { resolved } = useAppTheme();
  return useMemo(() => (resolved === 'dark' ? DARK : LIGHT), [resolved]);
}
