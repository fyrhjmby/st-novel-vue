
<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- 1. 顶部导航栏 (新) -->
      <div class="h-[56px] bg-white border-b border-gray-100 flex items-center px-6 flex-shrink-0">
        <div class="flex items-center gap-2 flex-1">
          <router-link to="/novel/dashboard" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg">
            <span v-html="icons.arrowLeft" class="w-4 h-4"></span>
            <span>返回</span>
          </router-link>
          <span class="text-gray-300">/</span>
          <span class="font-medium text-gray-800 text-sm">星际漫游者</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <span v-html="icons.search" class="w-5 h-5"></span>
          </button>
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <span v-html="icons.bell" class="w-5 h-5"></span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div class="ml-2 flex items-center gap-3">
            <div class="w-9 h-9 bg-gray-200 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-[#374151]">创作者</p>
              <p class="text-xs text-[#9CA3AF]">在线</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑器主容器 (三栏结构) -->
      <div class="h-[calc(100%-56px)] flex">

        <!-- 第1栏: 编辑器内部导航 (目录/相关/笔记) -->
        <aside class="w-80 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
          <div class="flex-shrink-0 px-4 pt-4 border-b border-gray-200">
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

          <!-- 目录 Tab -->
          <div v-if="activeInternalTab === 'directory'" class="flex-1 flex flex-col min-h-0 p-4">
            <div class="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 class="font-medium text-sm text-gray-700 px-2">章节大纲</h3>
              <div class="flex items-center gap-1">
                <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="添加新章节">
                  <span v-html="icons.plus" class="w-4 h-4"></span>
                </button>
                <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="展开/折叠">
                  <span v-html="icons.folderTree" class="w-4 h-4"></span>
                </button>
              </div>
            </div>
            <nav class="flex-1 space-y-1 text-sm overflow-auto pr-2 hide-scrollbar">
              <ul class="relative">
                <li v-for="volume in directory" :key="volume.id">
                  <a href="#" class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200">
                    <span v-html="icons.chevronDown" class="w-4 h-4 text-gray-400"></span>
                    <span v-html="icons.bookOpen" class="w-4 h-4 text-orange-500"></span>
                    <span class="font-semibold text-gray-800">{{ volume.title }}</span>
                  </a>
                  <ul class="pl-5 border-l ml-3.5 border-gray-200">
                    <li v-for="part in volume.parts" :key="part.id">
                      <a href="#" class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200">
                        <span v-html="icons.chevronDown" class="w-4 h-4 text-gray-400"></span>
                        <span v-html="icons.bookmark" class="w-4 h-4 text-sky-500"></span>
                        <span class="font-medium">{{ part.title }}</span>
                      </a>
                      <ul class="pl-5 border-l ml-3.5 border-gray-200">
                        <li v-for="chapter in part.chapters" :key="chapter.id">
                          <a href="#" @click.prevent="activeContent = {type: 'chapter', id: chapter.id}" :class="['flex items-center gap-2 p-2 rounded-md', activeContent.type === 'chapter' && activeContent.id === chapter.id ? 'text-blue-600 font-medium bg-blue-100' : 'hover:bg-gray-100 text-gray-600']">
                            <span v-html="icons.fileLines" class="w-4 h-4"></span>
                            <span>{{ chapter.title }}</span>
                            <span v-if="chapter.editing" class="text-xs ml-auto font-normal px-1.5 py-0.5 rounded bg-green-100 text-green-700">编辑中</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>

          <!-- 相关 Tab -->
          <div v-if="activeInternalTab === 'related'" class="flex-1 flex flex-col min-h-0 p-4">
            <div class="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 class="font-medium text-sm text-gray-700 px-2">相关内容</h3>
              <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="添加新条目">
                <span v-html="icons.plus" class="w-4 h-4"></span>
              </button>
            </div>
            <div class="mb-3 flex-shrink-0 relative">
              <span v-html="icons.search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"></span>
              <input type="text" placeholder="搜索相关内容..." class="w-full text-sm bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </div>
            <nav class="flex-1 text-sm overflow-auto pr-2 hide-scrollbar">
              <ul class="space-y-1">
                <li v-for="category in relatedItems" :key="category.name">
                  <a href="#" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span v-html="icons.chevronDown" class="w-4 h-4 text-gray-400"></span>
                    <span v-html="category.icon" :class="`w-5 h-5 text-center ${category.color}`"></span>
                    <span class="font-medium text-gray-800">{{ category.name }}</span>
                    <span class="ml-auto text-xs text-gray-400">{{ category.items.length }}</span>
                  </a>
                  <ul class="pl-6 border-l ml-2.5 space-y-1 mt-1">
                    <li v-for="item in category.items" :key="item.id">
                      <a href="#" @click.prevent="activeContent = {type: category.type, id: item.id}" :class="['flex items-center gap-3 p-2 rounded-lg text-sm', activeContent.type === category.type && activeContent.id === item.id ? `${category.activeBgColor} border ${category.activeBorderColor} font-medium ${category.activeTextColor}` : 'hover:bg-gray-100 text-gray-600']">
                        <span v-html="item.icon" class="w-4 h-4 flex-shrink-0"></span>
                        <span class="truncate">{{ item.title }}</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>

          <!-- 笔记 Tab -->
          <div v-if="activeInternalTab === 'notes'" class="flex-1 flex flex-col min-h-0 p-4">
            <div class="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 class="font-medium text-sm text-gray-700 px-2">章节笔记</h3>
              <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="新建笔记">
                <span v-html="icons.plus" class="w-4 h-4"></span>
              </button>
            </div>
            <div class="flex-1 space-y-2 overflow-y-auto pr-1 hide-scrollbar">
              <div v-for="note in notes" :key="note.id" @click="activeContent = {type: 'note', id: note.id}"
                   :class="['relative p-3 rounded-lg cursor-pointer transition-colors', activeContent.type === 'note' && activeContent.id === note.id ? 'bg-[#fef3c7] border border-[#fcd34d]' : 'bg-[#fefbeb] border border-[#fde68a] hover:bg-[#fef3c7]']">
                <span class="absolute top-2 right-3 text-xs text-[#92400e]">{{ note.timestamp }}</span>
                <p class="text-sm text-gray-700 font-medium mb-1 pr-16 truncate">{{ note.title }}</p>
                <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">{{ note.excerpt }}</p>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 flex-shrink-0">
              <div class="flex gap-2">
                <input type="text" placeholder="快速添加笔记..." class="flex-1 text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                <button class="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#4B5563] text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <span v-html="icons.paperPlane" class="w-4 h-4"></span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- 第2栏: 核心内容编辑区 -->
        <main class="flex-1 flex flex-col bg-white overflow-hidden relative">
          <!-- 编辑器顶部 -->
          <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center gap-3">
              <h1 class="text-lg font-medium text-[#374151]">{{ activeContentTitle }}</h1>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">已保存</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>字数: {{ activeContentWordCount }}</span>
                <span>•</span>
                <span>预计阅读: {{ Math.ceil(activeContentWordCount / 250) }}分钟</span>
              </div>
              <div class="flex items-center gap-1">
                <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="阅读模式">
                  <span v-html="icons.bookOpenReader" class="w-5 h-5"></span>
                </button>
                <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="版本历史">
                  <span v-html="icons.clockRotateLeft" class="w-5 h-5"></span>
                </button>
                <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="更多操作">
                  <span v-html="icons.ellipsisVertical" class="w-5 h-5"></span>
                </button>
              </div>
            </div>
          </header>
          <!-- 编辑器正文 -->
          <div class="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
            <div class="max-w-prose mx-auto prose prose-lg">
              <div v-html="activeContentBody"></div>
            </div>
          </div>

          <!-- UI交互效果展示 (静态) -->
          <div class="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 space-y-4 opacity-50 pointer-events-none">
            <!-- 编辑器工具栏 -->
            <div class="relative bg-white border border-gray-200 rounded-lg p-1.5 shadow-lg flex gap-1">
              <button v-for="tool in editorTools" :key="tool.title" :title="tool.title" class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                <span v-html="tool.icon" class="w-4 h-4"></span>
              </button>
            </div>
            <!-- 右键菜单 -->
            <div class="relative bg-white border border-gray-200 rounded-lg p-1 shadow-lg w-52">
              <div v-for="(item, index) in contextMenuItems" :key="index">
                <div v-if="item.divider" class="h-px bg-gray-100 my-1"></div>
                <a v-else href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                  <span v-html="item.icon" class="w-4 h-4 text-center text-gray-500"></span>
                  <span>{{ item.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        <!-- 第3栏: AI助手面板 -->
        <EditorAIPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EditorAIPanel from '@/novel/components/editor/EditorAIPanel.vue';
import '@/novel/style.css'

// --- 数据和状态 ---
const activeInternalTab = ref('directory');
const activeContent = ref({ type: 'chapter', id: 41 }); // 默认选中的内容

const internalTabs = [
  { id: 'directory', name: '目录' },
  { id: 'related', name: '相关' },
  { id: 'notes', name: '笔记' },
];

const icons = {
  arrowLeft: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>`,
  search: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>`,
  bell: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"/><path d="M13.73 21C13.5 21.6 12.8 22 12 22C11.2 22 10.5 21.6 10.27 21"/></svg>`,
  plus: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"></path></svg>`,
  folderTree: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 3h4.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0010.414 5H18a2 2 0 012 2v2M3 10v10a1 1 0 001 1h16a1 1 0 001-1V10M12 10v11"/></svg>`,
  chevronDown: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>`,
  bookOpen: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg>`,
  bookmark: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 22V5z"></path></svg>`,
  fileLines: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`,
  bookOpenReader: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.25278C12 6.25278 10.8239 5 8.5 5C5.46243 5 3 7.46243 3 10.5C3 15.0825 8.5 19 12 19C15.5 19 21 15.0825 21 10.5C21 7.46243 18.5376 5 15.5 5C13.1761 5 12 6.25278 12 6.25278Z"></path></svg>`,
  clockRotateLeft: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M23 12a11.05 11.05 0 00-22 0zm-11-7v7l5 5"></path><path d="M3.25 9L2 12l3.25 3"></path></svg>`,
  ellipsisVertical: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>`,
  users: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  user: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  world: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
  plot: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 6l-6 6 6 6M8 6l6 6-6 6"/></svg>`,
  analysis: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/></svg>`,
  paperPlane: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
  wand: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 3v2m5.657-1.343l-1.414 1.414M19 12h-2m1.343 5.657l-1.414-1.414M12 21v-2m-5.657 1.343l1.414-1.414M5 12H3m-1.343-5.657l1.414 1.414"/><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>`,
  spellCheck: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21.5 6l-9.5 9.5-4.5-4.5"/><path d="M3 13.5l4-10 4 10M5.5 10h5"/></svg>`,
  chart: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13 17V3M8 17v-7M18 17v-4"/></svg>`,
  expand: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`,
  compress: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>`,
  link: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.72-1.72"/></svg>`,
  copy: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  trash: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 6h18M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
}

const directory = ref([
  { id: 1, title: '第一卷：星尘之始', parts: [
      { id: 2, title: '上部：觉醒', chapters: [] },
      { id: 3, title: '下部：远航', chapters: [
          { id: 31, title: '第三章: 意外的信号', wordCount: 2105, content: '...' },
          { id: 41, title: '第四章: 跃迁点', editing: true, wordCount: 2415, content: '<h1>第四章: 跃迁点</h1><p>控制台的警报声将卡尔文从浅眠中惊醒。他猛地坐直，眼前的屏幕上一片红色闪烁。"发现引力异常，"艾拉的声音冷静得不带一丝情感，"正在接近理论中的跃迁点。这是我们唯一的回家机会。"</p><p>卡尔文的心跳漏了一拍。回家。这个词既熟悉又陌生，像一颗深埋的种子，在这一刻突然破土而出，疯狂生长。他深吸一口气，双手稳稳地放在控制杆上。"艾拉，计算跃迁参数，准备进入。"</p>' },
          { id: 51, title: '第五章: 新的黎明', wordCount: 1988, content: '...' },
        ]},
    ]},
]);

const relatedItems = ref([
  { name: '角色', type: 'character', icon: icons.users, color: 'text-teal-500', activeBgColor: 'bg-teal-50', activeBorderColor: 'border-teal-200', activeTextColor: 'text-teal-800',
    items: [
      { id: 101, title: '角色大纲', icon: icons.fileLines, wordCount: 158, content: '<h2>卡尔文·里德</h2><p><strong>定位：</strong>主角 • 飞船驾驶员</p><p><strong>简介：</strong>35岁，前地球联邦太空军飞行员。在一次例行任务中意外穿越虫洞，漂流至未知星系。性格冷静坚韧，但内心深处渴望回家。</p><p><strong>标签：</strong>领导者、孤独、坚韧</p><h2>艾拉（AILA）</h2><p><strong>定位：</strong>AI助手 • 飞船管理系统</p><p><strong>简介：</strong>飞船的人工智能管理系统，拥有高度拟人化的交流能力。在漫长的航行中成为卡尔文唯一的伙伴。</p><p><strong>标签：</strong>理性、忠诚、进化中</p>' },
      { id: 102, title: '卡尔文·里德', icon: icons.user },
      { id: 103, title: '艾拉 (AILA)', icon: icons.user },
    ]},
  { name: '世界观', type: 'world', icon: icons.world, color: 'text-sky-500', activeBgColor: 'bg-sky-50', activeBorderColor: 'border-sky-200', activeTextColor: 'text-sky-800',
    items: [
      { id: 201, title: '世界观总览', icon: icons.fileLines, wordCount: 121, content: '<h3>时间背景</h3><p>公元2157年，人类已经建立了跨越太阳系的文明。地球联邦统一管理着地球、月球、火星和木卫二的殖民地。</p><h3>科技水平</h3><p>掌握了亚光速飞行技术，但仍未突破光速壁垒。虫洞理论处于实验阶段。</p><p><em>核心技术：反物质引擎、量子通讯、人工智能</em></p>' },
      { id: 202, title: '时间背景', icon: icons.fileLines },
      { id: 203, title: '科技水平', icon: icons.fileLines },
    ]},
  { name: '剧情', type: 'plot', icon: icons.plot, color: 'text-indigo-500', activeBgColor: 'bg-indigo-50', activeBorderColor: 'border-indigo-200', activeTextColor: 'text-indigo-800',
    items: [
      { id: 301, title: '剧情大纲', icon: icons.fileLines },
      { id: 302, title: '第一卷', icon: icons.bookOpen },
    ]},
]);

const notes = ref([
  { id: 901, title: '第四章情感转折点设计', timestamp: '今天 14:32', excerpt: '卡尔文对"回家"的复杂情感需要更细腻的描写。考虑加入更多内心独白。', wordCount: 98, content: '<h2>第四章情感转折点设计</h2><p>卡尔文对"回家"的复杂情感需要更细腻的描写。考虑加入更多内心独白。</p><p>目前的写法“心跳漏了一拍”有些 cliché，可以尝试更具体的生理和心理反应。</p><ul><li>思路1：通过回忆莉娜的片段来加强回家的渴望。</li><li>思路2：让他对未知的跃迁点产生恐惧，与回家的希望形成矛盾冲突。</li><li>思路3：让艾拉的数据分析与他的直觉产生对比。</li></ul>' },
  { id: 902, title: '跃迁点物理描述', timestamp: '今天 11:20', excerpt: '查阅了相关资料，跃迁点可以描述为时空扭曲形成的漩涡状结构...', wordCount: 50, content: '<h2>跃迁点物理描述</h2><p>查阅了相关资料，跃迁点可以描述为时空扭曲形成的漩涡状结构，周围伴随着强烈的引力潮汐。</p>' },
  { id: 903, title: '艾拉角色发展', timestamp: '昨天 16:45', excerpt: '在这一章中，艾拉开始展现出超越程序设定的"直觉"。', wordCount: 45, content: '<h2>艾拉角色发展</h2><p>在这一章中，艾拉开始展现出超越程序设定的"直觉"。这是她向真正智慧生命进化的关键一步。</p>' },
]);

// --- 交互演示数据 ---
const editorTools = [
  { title: '分析内容', icon: icons.chart },
  { title: 'AI生成', icon: icons.wand },
  { title: '润色文本', icon: icons.spellCheck },
];

const contextMenuItems = [
  { label: 'AI续写', icon: icons.wand },
  { label: '扩写', icon: icons.expand },
  { label: '精简', icon: icons.compress },
  { divider: true },
  { label: '添加关联...', icon: icons.link },
  { label: '创建副本', icon: icons.copy },
  { divider: true },
  { label: '删除', icon: icons.trash, danger: true },
];

// --- 计算属性 ---
const findItem = (type: string, id: number) => {
  if (type === 'chapter') {
    for (const vol of directory.value) {
      for (const part of vol.parts) {
        const found = part.chapters.find(c => c.id === id);
        if (found) return found;
      }
    }
  }
  if (type === 'note') {
    return notes.value.find(n => n.id === id);
  }
  const category = relatedItems.value.find(cat => cat.type === type);
  return category?.items.find(item => item.id === id);
};

const activeContentData = computed(() => {
  const { type, id } = activeContent.value;
  return findItem(type, id);
});

const activeContentTitle = computed(() => activeContentData.value?.title || '未选择');
const activeContentWordCount = computed(() => activeContentData.value?.wordCount || 0);
const activeContentBody = computed(() => activeContentData.value?.content || '<p class="text-gray-400">请从左侧选择要编辑的内容。</p>');

</script>

<style scoped>
.design-frame-container { padding: 2rem; background-color: #f5f5f7; }
.design-frame { width: 100%; height: 100%; max-width: 1800px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.prose {
  color: #374151;
}
.prose h1, .prose h2, .prose h3 {
  color: #111827;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>