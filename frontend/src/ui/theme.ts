export type ThemeMode = 'light' | 'dark';

// Legacy shape kept so existing imports (`themes`, `AppTheme`) still type-check.
// Values mirror the CSS custom properties in `global.scss`; prefer reading
// tokens via `var(--color-*)` / `var(--space-*)` in `.module.scss` files.
export interface AppTheme {
  mode: ThemeMode;
}

export const themeDark: AppTheme = { mode: 'dark' };
export const themeLight: AppTheme = { mode: 'light' };
export const themes: Record<ThemeMode, AppTheme> = {
  dark: themeDark,
  light: themeLight,
};
export const theme = themeDark;
