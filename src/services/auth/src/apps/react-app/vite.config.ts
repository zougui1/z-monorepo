import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import '@zougui/common.config/node/to-browser';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['@zougui/common.react-store'],
  },
  build: {
    commonjsOptions: {
      include: ['/@zougui/common.react-store/', '/node_modules/'],
    },
  },
  envPrefix: 'REACT_APP',
  plugins: [react()],
});
