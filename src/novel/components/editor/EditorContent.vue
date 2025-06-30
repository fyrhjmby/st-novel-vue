// =
// 文件: ..\src\novel\components\editor\EditorContent.vue
//
// 说明: 编辑器中央的内容区域，包含内部的目录结构和主文本区。
//

<template>
  <main class="flex-1 flex flex-col bg-white">
    <!-- 顶部主标题 -->
    <header class="h-20 px-8 flex items-center border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">编辑章节</h1>
    </header>

    <!-- 内容区 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 内部左侧：目录、相关、笔记切换 -->
      <div class="w-[280px] border-r border-gray-100 flex flex-col flex-shrink-0">
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
            <!-- 卷和章节列表 -->
            <div class="space-y-2">
              <div v-for="volume in directory" :key="volume.id">
                <div class="flex items-center gap-2 p-2 rounded-md font-semibold text-gray-800 text-sm">
                  <span v-html="icons.volume" class="w-4 h-4 text-orange-500"></span>
                  <span>{{ volume.title }}</span>
                </div>
                <ul class="pl-6 mt-1 space-y-1">
                  <li v-for="chapter in volume.chapters" :key="chapter.id">
                    <a href="#" @click.prevent="activeChapterId = chapter.id" :class="['block p-2 rounded-md text-sm transition-colors', activeChapterId === chapter.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-100']">
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
          <!-- 其他标签页占位符 -->
          <div v-if="activeInternalTab === 'related'" class="text-center text-gray-400 pt-10">相关内容</div>
          <div v-if="activeInternalTab === 'notes'" class="text-center text-gray-400 pt-10">笔记</div>
        </div>
      </div>

      <!-- 内部右侧：编辑器正文 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="h-16 px-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-2 text-sm">
            <span v-html="icons.chapter" class="w-4 h-4 text-gray-500"></span>
            <span class="font-medium text-[#374151]">{{ activeChapter.title }}</span>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">已保存</span>
          </div>
          <div class="text-xs text-gray-500">字数: {{ activeChapter.wordCount }}</div>
        </div>
        <div class="flex-1 p-8 overflow-y-auto hide-scrollbar">
          <div class="max-w-prose mx-auto">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ activeChapter.title }}</h2>
            <p class="text-gray-700 leading-relaxed">{{ activeChapter.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const activeInternalTab = ref('directory');
const activeChapterId = ref(12);

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
      { id: 11, title: '第三章: 意外的信号', wordCount: 2105, content: '...' },
      { id: 12, title: '第四章: 跃迁点', wordCount: 2415, content: '控制台的警报声将卡尔文从浅眠中惊醒...' },
    ]
  }
]);

const activeChapter = computed(() => {
  for (const volume of directory.value) {
    const found = volume.chapters.find(c => c.id === activeChapterId.value);
    if (found) return found;
  }
  return { title: '未选择', wordCount: 0, content: '' };
});
</script>