import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset paths let the same build work at / and under a GitHub Pages repo path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
