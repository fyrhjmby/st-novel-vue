// =
// 文件: ..\src\workflow\layouts\WorkflowLayout.vue
//

<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- 统一的macOS风格窗口标题栏 -->
      <div class="h-10 px-5 flex items-center border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#28CA42]"></div>
        </div>
        <div class="ml-auto flex items-center gap-4 text-xs text-gray-400">
          <span>AI Creator Platform / Workflow</span>
        </div>
      </div>
      <div class="h-[calc(100%-40px)] flex">
        <!-- 工作流专用侧边栏 -->
        <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
          <div class="p-4 space-y-4 border-b border-gray-100">
            <div class="flex items-center gap-3 px-2">
              <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <div>
                <h3 class="font-medium text-[#374151] text-sm">AI Creator</h3>
                <p class="text-xs text-[#9CA3AF]">工作流引擎</p>
              </div>
            </div>
          </div>

          <nav class="flex-1 px-4 py-6">
            <div class="mb-8">
              <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">工作流管理</p>
              <div class="space-y-1">
                <router-link v-for="item in managementNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
                  <span v-html="item.icon"></span>
                  <span>{{ item.name }}</span>
                  <span v-if="item.count" class="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{{ item.count }}</span>
                  <span v-if="item.isNew" class="tag-new ml-auto">NEW</span>
                </router-link>
              </div>
            </div>

            <div>
              <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">配置</p>
              <div class="space-y-1">
                <router-link v-for="item in configNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
                  <span v-html="item.icon"></span>
                  <span>{{ item.name }}</span>
                </router-link>
              </div>
            </div>
          </nav>

          <!-- 用户信息区域 -->
          <div class="p-4 border-t border-gray-100">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3">
              <p class="text-xs font-semibold text-gray-700 mb-1">使用量统计</p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-600">本月已用</span>
                <span class="text-xs font-bold text-blue-600">5,420 / 10,000</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="bg-blue-600 h-1.5 rounded-full" style="width: 54%"></div>
              </div>
            </div>
            <router-link to="/settings" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1V6M12 18V23M4.22 4.22L7.76 7.76M16.24 16.24L19.78 19.78M1 12H6M18 12H23M4.22 19.78L7.76 16.24M16.24 7.76L19.78 4.22"/></svg>
              <span>设置</span>
            </router-link>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="flex-1 bg-white flex flex-col overflow-hidden">
          <AppHeader />
          <div class="flex-1 overflow-auto hide-scrollbar">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '@/layouts/components/AppHeader.vue' // 引入公用Header
import '@workflow/index.css';

const managementNav = ref([
  { name: '仪表盘', path: '/workflow/dashboard', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>` },
  { name: '我的工作流', path: '/workflow/my-flows', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 3V15M9 15L5 11M9 15L13 11"/><path d="M15 21V9M15 9L19 13M15 9L11 13"/></svg>`, count: 12 },
  { name: '模板市场', path: '/workflow/market', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`, isNew: true },
  { name: '运行历史', path: '/workflow/history', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>` },
]);

const configNav = ref([
  { name: '连接器', path: '/workflow/connectors', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` },
  { name: '变量库', path: '/workflow/variables', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>` },
  { name: '调度任务', path: '/workflow/schedules', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>` },
  { name: '回收站', path: '/workflow/trash', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M9 7V3h6v4M5 7h14l-1 10H6L5 7zm4 5h6m-4 0v4"/></svg>` },
]);
</script>

<style scoped>
/* 复制自 DefaultLayout.vue 以确保视觉一致性 */
.design-frame-container {
  padding: 2rem;
  background-color: #f5f5f7;
}
.design-frame {
  width: 100%;
  height: 100%;
  max-width: 1800px;
  margin: auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
.router-link-exact-active {
  color: white !important;
  background-color: #4B5563; /* active-class in template is better but this is a fallback */
}
</style>