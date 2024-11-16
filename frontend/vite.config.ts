import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,  // Development server port
		proxy: {
			'/api': 'http://localhost:5000',
		  },
	},
	build: {
		outDir: 'dist',  // Directory for production build output
	},
    base: '/',
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
