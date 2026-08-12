import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// 多页面应用（MPA）配置：每个 .html 作为独立入口，保持原有页面结构不变。
const pages = {
  index: 'index.html',
  features: 'features.html',
  about: 'about.html',
  contact: 'contact.html',
  privacy: 'privacy.html',
  terms: 'terms.html',
};

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: pages,
      output: {
        // 每个页面独立的产物目录，保持构建结构清晰
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          // 将体积较大的第三方库拆分为独立 chunk，便于浏览器缓存 & 消除大 chunk 警告
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) return 'vendor-xlsx';
            if (id.includes('jszip')) return 'vendor-jszip';
            if (id.includes('vue')) return 'vendor-vue';
            return 'vendor';
          }
        },
      },
    },
  },
});
