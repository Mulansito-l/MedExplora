import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,                 // Exponer para la red
    strictPort: true,           // Necesario para allowedHosts
    allowedHosts: true,         // TRUE = permite cualquier dominio
    cors: true,
  },

  preview: {
    allowedHosts: true,
  },
});
