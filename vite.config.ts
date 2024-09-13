import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    plugins: [react()],
    server: {
      open: true,
      proxy: {
        // [env.VITE_APP_BASE_API]: {
        //   target: env.VITE_SERVE,
        //   // 需要代理跨域
        //   changeOrigin: true,
        //   rewrite: (path: string) => path.replace(/^\/api/, ""),
        // },
        [env.VITE_APP_BASE_API]: {
          target: "https://www.flowertip.site:9000/admin-api",
          // 需要代理跨域
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src', // 设置别名
      },
    },
  }
})