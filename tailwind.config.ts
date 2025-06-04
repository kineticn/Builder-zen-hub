import type { Config } from "tailwindcss";

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
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["SF Pro Text", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        "1": "0.125rem", // 2px
        "2": "0.25rem", // 4px
        "3": "0.375rem", // 6px
        "4": "0.5rem", // 8px - base unit
        "5": "0.625rem", // 10px
        "6": "0.75rem", // 12px
        "8": "1rem", // 16px - 2x base
        "12": "1.5rem", // 24px - 3x base
        "16": "2rem", // 32px - 4x base
        "20": "2.5rem", // 40px - 5x base
        "24": "3rem", // 48px - 6x base
        "32": "4rem", // 64px - 8x base
      },
      colors: {
        // BillBuddy Brand Colors
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
        success: "#32D296",
        error: "#E44357",

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
      borderRadius: {
        lg: "1rem", // 2x base radius for cards
        md: "0.75rem",
        sm: "0.5rem",
        xs: "0.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.24)",
        "glass-lg": "0 12px 40px 0 rgba(31, 38, 135, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-slide": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(100%)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(0, 194, 178, 0.5)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(0, 194, 178, 0.8)",
          },
        },
      },
      animation: {
        "fade-slide": "fade-slide 200ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      minHeight: {
        touch: "44px", // Minimum touch target size
      },
      minWidth: {
        touch: "44px", // Minimum touch target size
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
