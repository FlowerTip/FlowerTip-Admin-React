import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    plugins: [react(), viteCompression({
      verbose: true, // 是否在控制台输出结果及过程信息
      disable: false, // 默认不禁止压缩
      deleteOriginFile: false, // 是否删除源文件
      threshold: 10240, // 体积大于threshold的文件会被压缩，单位为byte
      algorithm: 'gzip', // 使用gzip压缩
      ext: '.gz', // 生成压缩包的扩展名
    })],
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