import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      overlay: {
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '~': `${process.cwd()}/node_modules`,
      src: '/src',
    },
  },
  server: {
    port: 3031,
  },
  preview: {
    port: 3031,
  },
});
