import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { partytownVite } from "@builder.io/partytown/utils";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add CORS headers for development
    cors: true,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  plugins: [
    react(),
    // Partytown plugin for copying web worker files
    partytownVite({
      // Copy to public directory for better access
      dest: path.join(__dirname, "public", "~partytown"),
      // Enable debug in development
      debug: mode === "development",
      // Copy additional Partytown files
      copyLibFiles: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build configuration
  build: {
    // Ensure proper handling of web workers
    rollupOptions: {
      output: {
        // Keep Partytown files separate
        manualChunks: {
          partytown: ["@builder.io/partytown"],
        },
      },
    },
  },
  // Ensure web workers are properly handled
  worker: {
    format: "es",
    plugins: [react()],
  },
  optimizeDeps: {
    exclude: ["@builder.io/partytown"],
    // Include common dependencies
    include: ["react", "react-dom"],
  },
  // Handle cross-origin issues in development
  define: {
    // Ensure NODE_ENV is available
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
}));
