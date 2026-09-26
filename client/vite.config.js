import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // CHANGE ME: only used in local dev. Forwards API/image calls from
    // the Vite dev server to the Express server so you don't need to
    // deal with CORS while developing.
    proxy: {
      "/api": "http://localhost:4000",
      "/uploads": "http://localhost:4000",
    },
  },
});
