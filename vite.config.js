import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            navy: {
              950: "#0A192F",
              900: "#112240",
              800: "#1A365D",
              700: "#234E82",
            },
          },
        },
      },
    }),
  ],
});
