import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['packages/request/useAsyncHandler.ts'],
      rollupTypes: true,
      outDir: path.resolve(__dirname, 'dist')
    })
  ],
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
