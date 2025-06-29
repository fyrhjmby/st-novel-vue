import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      // 自动导入 Vue/Router/Pinia 的 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dirs: [
          'src/composables/**',
          'src/utils/**',
        ],
        dts: path.resolve(__dirname, 'src/types/auto-imports.d.ts'),
        vueTemplate: true,
      }),
      // 自动导入我们自己的组件
      Components({
        resolvers: [/* 这里不再需要 ElementPlusResolver */],
        dirs: [
          'src/components/base',
          'src/admin/components',
          'src/auth/components',
          'src/novel/components',
          'src/prompt/components',
          'src/roleplay/components',
          'src/settings/components',
          'src/workflow/components',
        ],
        dts: path.resolve(__dirname, 'src/types/components.d.ts'),
      }),
    ],

    // 路径别名配置 (适配我们的模块化架构)
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@admin': path.resolve(__dirname, 'src/admin'),
        '@auth': path.resolve(__dirname, 'src/auth'),
        '@novel': path.resolve(__dirname, 'src/novel'),
        '@prompt': path.resolve(__dirname, 'src/prompt'),
        '@roleplay': path.resolve(__dirname, 'src/roleplay'),
        '@settings': path.resolve(__dirname, 'src/settings'),
        '@workflow': path.resolve(__dirname, 'src/workflow'),
        '@core': path.resolve(__dirname, 'src/core'),
      }
    },

    // CSS 预处理器选项 (如果仍需使用Sass)
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    
    // 服务器配置 (保持不变)
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})