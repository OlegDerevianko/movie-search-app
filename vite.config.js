import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/movie-search-app/', // 👈 Замените на название вашего репозитория
});