/**
 * Design Token Utilities
 * Helper functions and utilities for working with design tokens
 */

import { tokens } from "./index";
import { themes, type ThemeMode, type Theme } from "./themes";

// Color utilities
export const getColorValue = (colorPath: string, theme?: ThemeMode): string => {
  const themeColors = theme ? themes[theme].colors : undefined;

  // Try to get from theme first, then fall back to tokens
  const pathParts = colorPath.split(".");
  let value: any = themeColors;

  for (const part of pathParts) {
    if (value && typeof value === "object" && part in value) {
      value = value[part];
    } else {
      // Fall back to tokens
      value = tokens.colors;
      for (const tokenPart of pathParts) {
        if (value && typeof value === "object" && tokenPart in value) {
          value = value[tokenPart];
        } else {
          return "#000000"; // fallback color
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : "#000000";
};

// Spacing utilities
export const getSpacing = (size: keyof typeof tokens.spacing): string => {
  return tokens.spacing[size];
};

// Font size utilities
export const getFontSize = (
  size: keyof typeof tokens.typography.fontSize,
): string => {
  return tokens.typography.fontSize[size];
};

// Border radius utilities
export const getBorderRadius = (
  size: keyof typeof tokens.borderRadius,
): string => {
  return tokens.borderRadius[size];
};

// Shadow utilities
export const getShadow = (size: keyof typeof tokens.shadows): string => {
  return tokens.shadows[size];
};

// Animation utilities
export const getAnimationDuration = (
  speed: keyof typeof tokens.animation.duration,
): string => {
  return tokens.animation.duration[speed];
};

export const getAnimationEasing = (
  easing: keyof typeof tokens.animation.easing,
): string => {
  return tokens.animation.easing[easing];
};

// Responsive utilities
export const getBreakpoint = (
  size: keyof typeof tokens.breakpoints,
): string => {
  return tokens.breakpoints[size];
};

// CSS Custom Properties generator
export const generateCSSCustomProperties = (theme: Theme) => {
  const properties: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([category, colors]) => {
    if (typeof colors === "object") {
      Object.entries(colors).forEach(([name, value]) => {
        if (typeof value === "string") {
          properties[`--color-${category}-${name}`] = value;
        }
      });
    }
  });

  // Component colors
  Object.entries(theme.components).forEach(([component, config]) => {
    Object.entries(config).forEach(([property, value]) => {
      if (typeof value === "string") {
        properties[`--${component}-${property}`] = value;
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([variant, variantValue]) => {
          if (typeof variantValue === "string") {
            properties[`--${component}-${property}-${variant}`] = variantValue;
          }
        });
      }
    });
  });

  return properties;
};

// CSS class name generators
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Token-based style generators
export const createButtonStyles = (
  variant: "primary" | "secondary" = "primary",
) => {
  const baseStyles = {
    height: tokens.components.button.height.md,
    borderRadius: tokens.components.button.borderRadius,
    fontSize: tokens.components.button.fontSize.md,
    fontWeight: tokens.typography.fontWeight.medium,
    minWidth: tokens.components.accessibility.minTouchTarget,
    minHeight: tokens.components.accessibility.minTouchTarget,
    transition: `all ${tokens.animation.duration.normal} ${tokens.animation.easing.easeOut}`,
  };

  const variantStyles = {
    primary: {
      backgroundColor: tokens.colors.primary.navy[900],
      color: tokens.colors.neutral.white,
    },
    secondary: {
      backgroundColor: tokens.colors.primary.teal[400],
      color: tokens.colors.neutral.white,
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
  };
};

export const createInputStyles = () => {
  return {
    height: tokens.components.input.height,
    borderRadius: tokens.components.input.borderRadius,
    fontSize: tokens.components.input.fontSize,
    padding: `0 ${tokens.spacing[4]}`,
    border: `1px solid ${tokens.colors.neutral.gray[300]}`,
    transition: `all ${tokens.animation.duration.normal} ${tokens.animation.easing.easeOut}`,
    ":focus": {
      outline: "none",
      borderColor: tokens.colors.primary.teal[400],
      boxShadow: `0 0 0 2px ${tokens.colors.primary.teal[400]}20`,
    },
  };
};

export const createCardStyles = () => {
  return {
    borderRadius: tokens.components.card.borderRadius,
    padding: tokens.components.card.padding,
    boxShadow: tokens.components.card.shadow,
    backgroundColor: tokens.colors.neutral.white,
    border: `1px solid ${tokens.colors.neutral.gray[200]}`,
  };
};

// Utility for creating consistent spacing
export const createSpacingClasses = () => {
  const spacingClasses: Record<string, string> = {};

  Object.entries(tokens.spacing).forEach(([key, value]) => {
    spacingClasses[`p-${key}`] = `padding: ${value}`;
    spacingClasses[`m-${key}`] = `margin: ${value}`;
    spacingClasses[`px-${key}`] =
      `padding-left: ${value}; padding-right: ${value}`;
    spacingClasses[`py-${key}`] =
      `padding-top: ${value}; padding-bottom: ${value}`;
    spacingClasses[`mx-${key}`] =
      `margin-left: ${value}; margin-right: ${value}`;
    spacingClasses[`my-${key}`] =
      `margin-top: ${value}; margin-bottom: ${value}`;
  });

  return spacingClasses;
};

// Accessibility helpers
export const createAccessibilityStyles = () => {
  return {
    minTouchTarget: {
      minWidth: tokens.components.accessibility.minTouchTarget,
      minHeight: tokens.components.accessibility.minTouchTarget,
    },
    focusRing: {
      outline: "none",
      boxShadow: tokens.components.accessibility.focusRing,
      outlineOffset: tokens.components.accessibility.focusOffset,
    },
    visuallyHidden: {
      position: "absolute" as const,
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap" as const,
      border: "0",
    },
  };
};

// Media query helpers
export const createMediaQueries = () => {
  const queries: Record<string, string> = {};

  Object.entries(tokens.breakpoints).forEach(([key, value]) => {
    queries[key] = `@media (min-width: ${value})`;
  });

  return queries;
};

// Animation helpers
export const createAnimationKeyframes = () => {
  return {
    shimmer: `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    fadeSlide: `
      @keyframes fadeSlide {
        from { 
          opacity: 0; 
          transform: translateY(10px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
    `,
  };
};

// Export all utilities
export const designTokenUtils = {
  getColorValue,
  getSpacing,
  getFontSize,
  getBorderRadius,
  getShadow,
  getAnimationDuration,
  getAnimationEasing,
  getBreakpoint,
  generateCSSCustomProperties,
  createButtonStyles,
  createInputStyles,
  createCardStyles,
  createSpacingClasses,
  createAccessibilityStyles,
  createMediaQueries,
  createAnimationKeyframes,
  cn,
};

export default designTokenUtils;
