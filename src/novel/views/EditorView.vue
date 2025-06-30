// =
// 文件: ..\src\novel\views\EditorView.vue
// 说明: 编辑器专属的独立视图，构建了您设计的完整多栏布局。
//

<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- 模拟顶部窗口栏 -->
      <div class="h-10 px-5 flex items-center border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#28CA42]"></div>
        </div>
        <div class="ml-auto flex items-center gap-4 text-xs text-gray-400">
          <span>AI Creator Platform</span>
        </div>
      </div>

      <!-- 编辑器主容器 (四栏结构) -->
      <div class="h-[calc(100%-40px)] flex">
        <!-- 第1栏: 小说管理侧边栏 -->
        <NovelManagementSidebar />

        <!-- 第2栏: 编辑器内部导航 (目录/相关/笔记) -->
        <div class="w-[320px] border-r border-gray-100 flex flex-col flex-shrink-0 bg-white">
          <header class="h-20 px-6 flex items-center border-b border-gray-100 flex-shrink-0">
            <router-link to="/novel/dashboard" class="flex items-center gap-2 text-gray-500 hover:text-gray-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
              <span class="text-sm font-medium">编辑章节</span>
            </router-link>
          </header>
          <div class="px-4 pt-4 border-b border-gray-200">
            <div class="flex items-center">
              <button
                  v-for="tab in internalTabs"
                  :key="tab.id"
                  @click="activeInternalTab = tab.id"
                  :class="['px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px', activeInternalTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
              >
                {{ tab.name }}
              </button>
            </div>
          </div>
          <div class="flex-1 p-4 overflow-y-auto hide-scrollbar">
            <!-- 目录内容 -->
            <div v-if="activeInternalTab === 'directory'">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-600">章节大纲</h3>
                <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="添加新章节">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"></path></svg>
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="volume in directory" :key="volume.id">
                  <div class="flex items-center gap-2 p-2 rounded-md font-semibold text-gray-800 text-sm">
                    <span v-html="icons.volume" class="w-4 h-4 text-orange-500"></span>
                    <span>{{ volume.title }}</span>
                  </div>
                  <ul class="pl-6 mt-1 space-y-1">
                    <li v-for="chapter in volume.chapters" :key="chapter.id">
                      <a href="#" :class="['block p-2 rounded-md text-sm transition-colors', chapter.active ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-100']">
                        <div class="flex items-center gap-2">
                          <span v-html="icons.chapter" class="w-4 h-4 flex-shrink-0"></span>
                          <span class="truncate">{{ chapter.title }}</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第3栏: 核心内容编辑区 -->
        <main class="flex-1 flex flex-col bg-white overflow-hidden">
          <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center gap-2 text-sm">
              <span v-html="icons.chapter" class="w-4 h-4 text-gray-500"></span>
              <span class="font-medium text-[#374151]">第四章: 跃迁点</span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">已保存</span>
            </div>
            <div class="text-xs text-gray-500">字数: 2415</div>
          </header>
          <div class="flex-1 p-8 overflow-y-auto hide-scrollbar">
            <div class="max-w-prose mx-auto">
              <h2 class="text-2xl font-semibold text-gray-800 mb-6">第四章: 跃迁点</h2>
              <p class="text-gray-700 leading-relaxed text-base">控制台的警报声将卡尔文从浅眠中惊醒...</p>
            </div>
          </div>
        </main>

        <!-- 第4栏: AI助手面板 -->
        <EditorAIPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NovelManagementSidebar from '@/novel/components/NovelManagementSidebar.vue';
import EditorAIPanel from '@/novel/components/editor/EditorAIPanel.vue';
import '@/novel/style.css'

const activeInternalTab = ref('directory');

const internalTabs = [
  { id: 'directory', name: '目录' },
  { id: 'related', name: '相关' },
  { id: 'notes', name: '笔记' },
];

const icons = {
  volume: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 22V5z"></path></svg>`,
  chapter: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
};

const directory = ref([
  {
    id: 1,
    title: '第一卷：星尘之始',
    chapters: [
      { id: 11, title: '第三章: 意外的信号', active: false },
      { id: 12, title: '第四章: 跃迁点', active: true },
    ]
  }
]);

</script>

<style scoped>
.design-frame-container { padding: 2rem; background-color: #f5f5f7; }
.design-frame { width: 100%; height: 100%; max-width: 1800px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>