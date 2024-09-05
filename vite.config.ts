import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  resolve: {
    alias: {
      '@': '/src', // 设置别名
    },
  },
})
