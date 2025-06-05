import type { Config } from "tailwindcss";
import { tokens } from "./src/design-tokens";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: tokens.layout.container.padding,
      screens: tokens.breakpoints,
    },
    extend: {
      fontFamily: tokens.typography.fontFamily,
      spacing: tokens.spacing,
      colors: {
        // BillBuddy Brand Colors
        navy: tokens.colors.primary.navy,
        teal: tokens.colors.primary.teal,
        success: tokens.colors.semantic.success,
        error: tokens.colors.semantic.error,
        warning: tokens.colors.semantic.warning,
        info: tokens.colors.semantic.info,

        // Neutral colors
        gray: tokens.colors.neutral.gray,

        // System colors mapped to brand
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0A2540", // navy-900
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#00C2B2", // teal-400
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#E44357", // error
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#00C2B2", // teal-400
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: tokens.borderRadius,
      boxShadow: {
        ...tokens.shadows,
        glass: tokens.shadows.glass,
        "glass-sm": tokens.shadows.glassSm,
        "glass-lg": tokens.shadows.glassLg,
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        ...tokens.animation.keyframes,
        "fade-slide": tokens.animation.keyframes.fadeSlide,
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: `0 0 5px ${tokens.colors.primary.teal[400]}50`,
          },
          "50%": { boxShadow: `0 0 20px ${tokens.colors.primary.teal[400]}CC` },
        },
      },
      animation: {
        "fade-slide": `fade-slide ${tokens.animation.duration.normal} ${tokens.animation.easing.easeOut}`,
        "slide-up": `slide-up ${tokens.animation.duration.normal} ${tokens.animation.easing.easeOut}`,
        "pulse-glow": `pulse-glow ${tokens.components.skeleton.animationDuration} ${tokens.animation.easing.easeInOut} infinite`,
        shimmer: `shimmer ${tokens.components.skeleton.animationDuration} ${tokens.animation.easing.easeInOut} infinite`,
        pulse: `pulse ${tokens.components.skeleton.animationDuration} ${tokens.animation.easing.easeInOut} infinite`,
      },
      minHeight: {
        touch: tokens.components.accessibility.minTouchTarget,
      },
      minWidth: {
        touch: tokens.components.accessibility.minTouchTarget,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
