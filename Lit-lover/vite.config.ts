import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Le indicamos a Lovable que active el empaquetado de Nitro para Vercel
  nitro: {
    preset: "vercel"
  },
  vite: {
    // Dejamos esto como lo tenía Lovable por si sus scripts internos lo requieren
    build: {
      outDir: "dist",   
    }
  }
});