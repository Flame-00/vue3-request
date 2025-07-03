import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['packages/request/useAsyncHandler.ts'],
      rollupTypes: true,
      outDir: path.resolve(__dirname, 'dist')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/request/useAsyncHandler.ts'),
      name: 'vue3-async-handler-hooks',
      formats: ['es', 'cjs'],
      fileName: (format) => `vue3-async-handler-hooks.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
