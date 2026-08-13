import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "ระบบบันทึกรายรับรายจ่าย",
        short_name: "รายรับรายจ่าย",
        description: "ระบบบันทึกรายรับรายจ่าย",
        lang: "th",

        start_url: "/",
        scope: "/",
        display: "standalone",

        background_color: "#ffffff",
        theme_color: "#4CAF50",

        icons: [
          {
            src: "/BiwBoong.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/BiwBoong.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});