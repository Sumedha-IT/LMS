import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js', // Main JS file
                'resources/css/filament/administrator/theme.css',
            ],
            refresh: true,
        }),
        react(), // Ensure this plugin is included to handle React JSX
    ],
});
