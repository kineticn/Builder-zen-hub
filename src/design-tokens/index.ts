/**
 * BillBuddy Design Tokens
 * Centralized design system tokens for consistent brand experience
 */

// Color Palette
export const colors = {
  // Primary Brand Colors
  primary: {
    navy: {
      50: "#f0f4f8",
      100: "#d9e8f5",
      200: "#b3d1eb",
      300: "#85b4dc",
      400: "#5692ca",
      500: "#3574b8",
      600: "#285ca3",
      700: "#1f4985",
      800: "#1c3d6e",
      900: "#0A2540", // Primary navy
      950: "#081b2e",
    },
    teal: {
      50: "#f0fdfc",
      100: "#ccfbf6",
      200: "#99f6ed",
      300: "#5de9d7",
      400: "#00C2B2", // Primary teal
      500: "#14b8a6",
      600: "#0f9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
      950: "#042f2e",
    },
  },

  // Semantic Colors
  semantic: {
    success: "#32D296",
    error: "#E44357",
    warning: "#F59E0B",
    info: "#3B82F6",
  },

  // Neutral Colors
  neutral: {
    white: "#FFFFFF",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    black: "#000000",
  },

  // Opacity Variations
  opacity: {
    glass: "rgba(255, 255, 255, 0.1)",
    glassDark: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(10, 37, 64, 0.8)", // navy with opacity
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    primary: ["SF Pro Text", "system-ui", "sans-serif"],
    display: ["Inter", "system-ui", "sans-serif"],
    mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

// Spacing Scale (8px base unit)
export const spacing = {
  0: "0",
  1: "0.125rem", // 2px
  2: "0.25rem", // 4px
  3: "0.375rem", // 6px
  4: "0.5rem", // 8px - base unit
  5: "0.625rem", // 10px
  6: "0.75rem", // 12px
  8: "1rem", // 16px - 2x base
  10: "1.25rem", // 20px
  12: "1.5rem", // 24px - 3x base
  16: "2rem", // 32px - 4x base
  20: "2.5rem", // 40px - 5x base
  24: "3rem", // 48px - 6x base
  32: "4rem", // 64px - 8x base
  40: "5rem", // 80px - 10x base
  48: "6rem", // 96px - 12x base
  64: "8rem", // 128px - 16x base
} as const;

// Border Radius
export const borderRadius = {
  none: "0",
  xs: "0.125rem", // 2px
  sm: "0.25rem", // 4px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Shadows
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

  // Glass morphism shadows
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  glassSm: "0 4px 16px 0 rgba(31, 38, 135, 0.24)",
  glassLg: "0 12px 40px 0 rgba(31, 38, 135, 0.45)",
} as const;

// Animations & Transitions
export const animation = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  easing: {
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
  keyframes: {
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    fadeSlide: {
      from: { opacity: "0", transform: "translateY(10px)" },
      to: { opacity: "1", transform: "translateY(0)" },
    },
  },
} as const;

// Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  modal: 20,
  notification: 30,
  tooltip: 40,
  overlay: 50,
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: spacing[8], // 32px
      md: spacing[12], // 48px
      lg: spacing[16], // 64px
    },
    borderRadius: borderRadius.lg,
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg,
    },
  },
  input: {
    height: spacing[12], // 48px
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    shadow: shadows.base,
  },
  skeleton: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.gray[200],
    backgroundColorDark: colors.neutral.gray[700],
    shimmerColor: colors.neutral.gray[300],
    shimmerColorDark: colors.neutral.gray[600],
    animationDuration: "2s",
  },
  // Accessibility
  accessibility: {
    minTouchTarget: "44px",
    focusRing: `2px solid ${colors.primary.teal[400]}`,
    focusOffset: "2px",
  },
} as const;

// Layout tokens
export const layout = {
  container: {
    maxWidth: breakpoints["2xl"],
    padding: spacing[4],
  },
  section: {
    paddingY: spacing[20],
  },
  grid: {
    gap: spacing[6],
  },
} as const;

// Export everything as default tokens object
export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  components,
  layout,
} as const;

export default tokens;

// Type exports for TypeScript
export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type DesignTokens = typeof tokens;
