import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { partytownVite } from "@builder.io/partytown/utils";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Partytown plugin for copying web worker files
    partytownVite({
      // Optional: specify destination directory
      dest: path.join(__dirname, "dist", "~partytown"),
      // Optional: debug mode
      debug: mode === "development",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure web workers are properly handled
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["@builder.io/partytown"],
  },
}));
