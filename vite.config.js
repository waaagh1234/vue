import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      // 代理所有API请求
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // 代理其他后端请求
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/reset-password': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/cart': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/product': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/search': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/user-favorites': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/purchase-records': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/direct-purchase': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },

      // 代理图片资源 - 如果后端返回的是相对路径
      '/images': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // 代理templates目录下的静态资源（包括图片）
      '/templates': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  // 配置静态资源别名
  resolve: {
    alias: {
      '@': '/src',
      '@images': '/src/assets/images'
    }
  }
})

