import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const codegenStub = path.resolve(__dirname, './src/stubs/codegenNativeComponent.js');
const rnShimPath = path.resolve(__dirname, './src/stubs/reactNativeWebShim.js');
const svgWebStub = path.resolve(__dirname, './src/stubs/reactNativeSvgWeb.jsx');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: /^react-native-svg$/, replacement: svgWebStub },
      { find: /^react-native-svg\/(.*)$/, replacement: svgWebStub },
      {
        find: 'react-native/Libraries/Utilities/codegenNativeComponent',
        replacement: codegenStub,
      },
      {
        find: 'react-native-web/Libraries/Utilities/codegenNativeComponent',
        replacement: codegenStub,
      },
      { find: /^react-native$/, replacement: rnShimPath },
    ],
  },
  server: {
    port: 3005,
    host: true,
  },
});
