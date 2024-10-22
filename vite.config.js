import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      external: [
        'public/css/bootstrap.min.css',
        'public/css/font-awesome.min.css',
        'public/css/animate.css',
        'public/css/owl.carousel.css',
        'public/css/venobox.css',
        'public/css/styles.css',
        'public/css/style.css',
        'public/js/jquery.min.js',
        'public/js/bootstrap.min.js',
        'public/js/wow.min.js',
        'public/js/jquery.backTop.min.js',
        'public/js/waypoints.min.js',
        'public/js/waypoints-sticky.min.js',
        'public/js/owl.carousel.min.js',
        'public/js/jquery.stellar.min.js',
        'public/js/jquery.counterup.min.js',
        'public/js/venobox.min.js',
        'public/js/custom-scripts.js',
      ],
    },
  },
});
