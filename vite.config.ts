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
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'packages/request/useAsyncHandler.ts'),
      name: 'Vue3AsyncHandler',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `vue3-async-handler.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
  }
})
