// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      laravel({
        input: [
          'resources/css/app.css',
          'resources/js/index.jsx', // Ensure this is the entry point
          'resources/css/filament/administrator/theme.css',
        ],
        refresh: true,
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'], // Add .jsx here
    },
    define: {
      'import.meta.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
      'import.meta.env.VITE_APP_API_URL': JSON.stringify(env.VITE_APP_API_URL),
    },
  };
});