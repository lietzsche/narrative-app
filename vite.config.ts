import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
    plugins: [react()],
    // dev: '/', build: '/narrative-app/'
    base: command === 'build' ? '/narrative-app/' : '/',
}))