/**
 * Console warning filter utility
 * Suppresses specific known warnings that don't affect functionality
 */

// Store original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Patterns of warnings to suppress
const suppressedWarningPatterns = [
  /Support for defaultProps will be removed from function components.*XAxis/,
  /Support for defaultProps will be removed from function components.*YAxis/,
  /Support for defaultProps will be removed from function components.*recharts/,
];

/**
 * Filters console warnings to suppress known library warnings
 * @param args - Console arguments
 * @returns true if warning should be suppressed
 */
const shouldSuppressWarning = (...args: any[]): boolean => {
  const message = args.join(" ");
  return suppressedWarningPatterns.some((pattern) => pattern.test(message));
};

/**
 * Initialize console filtering for development environment
 */
export const initConsoleFilter = (): void => {
  // Only filter in development to avoid hiding real issues in production
  if (process.env.NODE_ENV === "development") {
    console.warn = (...args: any[]) => {
      if (!shouldSuppressWarning(...args)) {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args: any[]) => {
      if (!shouldSuppressWarning(...args)) {
        originalError.apply(console, args);
      }
    };
  }
};

/**
 * Restore original console methods
 */
export const restoreConsole = (): void => {
  console.warn = originalWarn;
  console.error = originalError;
};

/**
 * Execute a function with console filtering temporarily disabled
 * @param fn - Function to execute
 * @returns Result of function execution
 */
export const withoutConsoleFilter = <T>(fn: () => T): T => {
  restoreConsole();
  try {
    return fn();
  } finally {
    initConsoleFilter();
  }
};
