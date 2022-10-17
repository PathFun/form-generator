/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';
import lessCopy from './plugins/less-copy.js';
const { name } = require('./package.json');
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    lessCopy(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue']
    })
    // Components({
    //   resolvers: [
    //     AntDesignVueResolver({
    //       importStyle: 'less',
    //       resolveIcons: true
    //     })
    //   ],
    //   include: [/\.vue$/, /\.jsx$/]
    // })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: name
    },
    rollupOptions: {
      external: ['vue', 'form-render-vue3'],
      output: {
        globals: {
          vue: 'Vue',
          'form-render-vue3': 'formRenderVue3'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {},
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  define: {
    'import.meta.vitest': 'undefined'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
});
