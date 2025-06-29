/** @type {import('tailwindcss').Config} */
export default {
  // 指定 Tailwind 需要扫描的文件，以进行 Tree-shaking
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  // 自定义主题
  theme: {
    extend: {
      // 我们可以把UI设计稿中的颜色定义为Tailwind的色板
      colors: {
        primary: {
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F2937',
          '900': '#111827',
        },
        accent: {
          green: '#10B981',
          blue: '#3B82F6',
          red: '#EF4444',
          yellow: '#F59E0B'
        }
      }
    },
  },
  
  // 插件配置
  plugins: [
    require('daisyui'), // 引入 DaisyUI 插件
  ],

  // DaisyUI 的专属配置
  daisyui: {
    themes: ["light"], // 你可以在这里配置多个主题，如 ["light", "dark"]
    darkTheme: "dark", // 默认的暗黑主题
    base: true, // 应用基础样式
    styled: true, // 应用 DaisyUI 的组件样式
    utils: true, // 应用 DaisyUI 的工具类
    log: true, // 在控制台显示主题信息
    themeRoot: ":root", // 主题作用的根元素
  },
}