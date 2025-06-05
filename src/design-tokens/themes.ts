/**
 * BillBuddy Theme Variations
 * Light and dark theme configurations using design tokens
 */

import { tokens } from "./index";

// Light Theme
export const lightTheme = {
  colors: {
    // Backgrounds
    background: {
      primary: tokens.colors.neutral.white,
      secondary: tokens.colors.neutral.gray[50],
      tertiary: tokens.colors.neutral.gray[100],
      inverse: tokens.colors.primary.navy[900],
    },

    // Text colors
    text: {
      primary: tokens.colors.neutral.gray[900],
      secondary: tokens.colors.neutral.gray[600],
      tertiary: tokens.colors.neutral.gray[400],
      inverse: tokens.colors.neutral.white,
      accent: tokens.colors.primary.teal[400],
    },

    // Border colors
    border: {
      primary: tokens.colors.neutral.gray[200],
      secondary: tokens.colors.neutral.gray[100],
      focus: tokens.colors.primary.teal[400],
    },

    // Interactive states
    interactive: {
      hover: tokens.colors.neutral.gray[50],
      active: tokens.colors.neutral.gray[100],
      disabled: tokens.colors.neutral.gray[200],
    },

    // Status colors
    status: {
      success: tokens.colors.semantic.success,
      error: tokens.colors.semantic.error,
      warning: tokens.colors.semantic.warning,
      info: tokens.colors.semantic.info,
    },

    // Brand colors
    brand: {
      primary: tokens.colors.primary.navy[900],
      secondary: tokens.colors.primary.teal[400],
    },
  },

  // Component-specific overrides
  components: {
    skeleton: {
      background: tokens.colors.neutral.gray[200],
      shimmer: tokens.colors.neutral.gray[300],
    },
    card: {
      background: tokens.colors.neutral.white,
      border: tokens.colors.neutral.gray[200],
      shadow: tokens.shadows.base,
    },
    button: {
      primary: {
        background: tokens.colors.primary.navy[900],
        text: tokens.colors.neutral.white,
        hover: tokens.colors.primary.navy[800],
        active: tokens.colors.primary.navy[950],
      },
      secondary: {
        background: tokens.colors.primary.teal[400],
        text: tokens.colors.neutral.white,
        hover: tokens.colors.primary.teal[500],
        active: tokens.colors.primary.teal[600],
      },
    },
  },
} as const;

// Dark Theme
export const darkTheme = {
  colors: {
    // Backgrounds
    background: {
      primary: tokens.colors.neutral.gray[900],
      secondary: tokens.colors.neutral.gray[800],
      tertiary: tokens.colors.neutral.gray[700],
      inverse: tokens.colors.neutral.white,
    },

    // Text colors
    text: {
      primary: tokens.colors.neutral.white,
      secondary: tokens.colors.neutral.gray[300],
      tertiary: tokens.colors.neutral.gray[400],
      inverse: tokens.colors.neutral.gray[900],
      accent: tokens.colors.primary.teal[400],
    },

    // Border colors
    border: {
      primary: tokens.colors.neutral.gray[700],
      secondary: tokens.colors.neutral.gray[800],
      focus: tokens.colors.primary.teal[400],
    },

    // Interactive states
    interactive: {
      hover: tokens.colors.neutral.gray[800],
      active: tokens.colors.neutral.gray[700],
      disabled: tokens.colors.neutral.gray[700],
    },

    // Status colors (same as light theme)
    status: {
      success: tokens.colors.semantic.success,
      error: tokens.colors.semantic.error,
      warning: tokens.colors.semantic.warning,
      info: tokens.colors.semantic.info,
    },

    // Brand colors
    brand: {
      primary: tokens.colors.primary.teal[400],
      secondary: tokens.colors.primary.navy[400],
    },
  },

  // Component-specific overrides
  components: {
    skeleton: {
      background: tokens.colors.neutral.gray[700],
      shimmer: tokens.colors.neutral.gray[600],
    },
    card: {
      background: tokens.colors.neutral.gray[800],
      border: tokens.colors.neutral.gray[700],
      shadow: "none",
    },
    button: {
      primary: {
        background: tokens.colors.primary.teal[400],
        text: tokens.colors.neutral.white,
        hover: tokens.colors.primary.teal[500],
        active: tokens.colors.primary.teal[600],
      },
      secondary: {
        background: tokens.colors.primary.navy[600],
        text: tokens.colors.neutral.white,
        hover: tokens.colors.primary.navy[500],
        active: tokens.colors.primary.navy[700],
      },
    },
  },
} as const;

// Theme utilities
export const createThemeCSS = (theme: typeof lightTheme) => {
  return {
    ":root": {
      // CSS Custom Properties for runtime theme switching
      "--color-background-primary": theme.colors.background.primary,
      "--color-background-secondary": theme.colors.background.secondary,
      "--color-background-tertiary": theme.colors.background.tertiary,
      "--color-text-primary": theme.colors.text.primary,
      "--color-text-secondary": theme.colors.text.secondary,
      "--color-text-tertiary": theme.colors.text.tertiary,
      "--color-border-primary": theme.colors.border.primary,
      "--color-border-secondary": theme.colors.border.secondary,
      "--color-brand-primary": theme.colors.brand.primary,
      "--color-brand-secondary": theme.colors.brand.secondary,
    },
  };
};

// Export theme configurations
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeMode = keyof typeof themes;
export type Theme = typeof lightTheme;

export default themes;
