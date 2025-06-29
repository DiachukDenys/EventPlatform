import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      axios: path.resolve(__dirname, 'src/utils/api.js'),
    },
  },
});