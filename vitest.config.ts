/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    env: {
      MICROCMS_SERVICE_DOMAIN: 'example',
      MICROCMS_API_KEY: 'api-key',
    }
  },
  resolve: {
    alias: {
      '@': __dirname + '/src',
    },
  },
})