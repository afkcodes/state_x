import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    rollupOptions: { external: ['react', 'react/jsx-runtime'] },
    lib: {
      entry: './src/index.ts',
      name: 'index',
      fileName: 'index',
    },
  },
});
