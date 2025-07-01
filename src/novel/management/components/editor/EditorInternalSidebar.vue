<template>
  <aside ref="sidebarRef" class="w-[320px] border-r border-gray-100 flex flex-col flex-shrink-0 bg-[#FAFAFA] relative">
    <!-- Tab Navigation -->
    <div class="px-4 pt-4 border-b border-gray-200">
      <div class="tabs tabs-bordered">
        <a
            v-for="tab in internalTabs"
            :key="tab.id"
            @click="activeInternalTab = tab.id"
            role="tab"
            :class="['tab', { 'tab-active text-blue-600': activeInternalTab === tab.id }]"
        >
          {{ tab.name }}
        </a>
      </div>
    </div>

    <!-- Main Content Area with Overflow -->
    <div class="flex-1 p-4 overflow-y-auto hide-scrollbar">
      <!-- Directory Content (目录) -->
      <div v-if="activeInternalTab === 'directory'" class="space-y-1">
        <div class="flex items-center justify-between mb-3 px-2">
          <h3 class="text-sm font-medium text-gray-600">章节大纲</h3>
          <div class="flex items-center gap-1">
            <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="添加新章节">
              <i class="fa-solid fa-plus fa-xs"></i>
            </button>
            <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="折叠/展开全部">
              <i class="fa-solid fa-folder-tree fa-xs"></i>
            </button>
          </div>
        </div>
        <!-- Chapter List with Context Menu Event -->
        <ul v-for="volume in directory" :key="volume.id" class="space-y-1">
          <li>
            <a href="#" @click.prevent="setActiveItem(volume)" @contextmenu.prevent="showDirectoryContextMenu(volume, $event)" class="flex items-center gap-3 p-2 rounded-lg font-medium text-sm transition-colors" :class="activeItem.id === volume.id ? 'bg-gray-200 text-gray-800' : 'text-gray-700 hover:bg-gray-100'">
              <i class="fa-solid fa-chevron-down w-4 text-gray-400"></i>
              <i class="fa-solid fa-book-open w-4 text-orange-500"></i>
              <span>{{ volume.title }}</span>
            </a>
            <ul class="pl-5 mt-1 space-y-1 border-l ml-3.5 border-gray-200">
              <li v-for="chapter in volume.chapters" :key="chapter.id">
                <a href="#" @click.prevent="setActiveItem(chapter)" @contextmenu.prevent="showDirectoryContextMenu(chapter, $event)" class="flex items-center gap-3 p-2 rounded-lg text-sm transition-colors" :class="activeItem.id === chapter.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600 hover:bg-gray-100'">
                  <i class="fa-solid fa-file-lines w-4" :class="{'text-blue-600': activeItem.id === chapter.id, 'text-gray-400': activeItem.id !== chapter.id}"></i>
                  <span class="truncate">{{ chapter.title }}</span>
                  <span v-if="chapter.status === 'editing'" class="ml-auto text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-normal">编辑中</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Related Content (相关) -->
      <div v-if="activeInternalTab === 'related'" class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-3 px-2 flex-shrink-0">
          <h3 class="text-sm font-medium text-gray-600">相关内容</h3>
          <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="添加新条目"><i class="fa-solid fa-plus fa-xs"></i></button>
        </div>
        <div class="mb-4 relative flex-shrink-0">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" placeholder="搜索角色、地点、设定..." class="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
        </div>
        <ul class="space-y-1 flex-grow overflow-y-auto">
          <li v-for="group in relatedItems" :key="group.type">
            <a href="#" class="flex items-center gap-3 p-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100">
              <i class="fa-solid fa-chevron-down w-4 text-gray-400"></i>
              <i class="w-4 text-center" :class="group.icon"></i>
              <span>{{ group.title }}</span>
              <span class="ml-auto text-xs text-gray-400 font-normal">{{ group.items.length }}</span>
            </a>
            <ul class="pl-6 border-l ml-2.5 space-y-1 mt-1">
              <li v-for="item in group.items" :key="item.id">
                <a href="#" @click.prevent="setActiveItem(item)" class="flex items-center gap-3 p-2 rounded-lg text-sm" :class="activeItem.id === item.id ? `bg-${group.color}-100 text-${group.color}-800 font-medium border border-${group.color}-200` : 'text-gray-600 hover:bg-gray-100'">
                  <i class="w-4" :class="[item.icon, activeItem.id === item.id ? `text-${group.color}-600` : 'text-gray-400']"></i>
                  <span class="truncate">{{ item.title }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Notes Content (笔记) -->
      <div v-if="activeInternalTab === 'notes'" class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-3 px-2 flex-shrink-0">
          <h3 class="text-sm font-medium text-gray-600">章节笔记</h3>
          <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-md transition-colors" title="新建笔记"><i class="fa-solid fa-plus fa-xs"></i></button>
        </div>
        <div class="flex-grow space-y-2 overflow-y-auto pr-1">
          <div v-for="note in noteItems" :key="note.id" @click="setActiveItem(note)" class="p-3 rounded-lg cursor-pointer transition-colors" :class="activeItem.id === note.id ? 'bg-yellow-100 border border-yellow-300' : 'bg-white hover:bg-gray-50 border border-transparent'">
            <div class="flex justify-between items-start">
              <p class="text-sm font-medium text-gray-800 pr-12">{{ note.title }}</p>
              <span class="text-xs text-yellow-800 flex-shrink-0">{{ note.timestamp }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">{{ note.content }}</p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-2">
            <input type="text" placeholder="快速添加新笔记..." class="flex-1 w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <button class="w-8 h-8 flex-shrink-0 bg-[#4B5563] text-white rounded-lg hover:bg-[#374151] flex items-center justify-center"><i class="fa-solid fa-paper-plane fa-sm"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Directory Context Menu -->
    <div
        v-if="isDirectoryContextMenuVisible"
        :style="{ top: `${contextMenuPosition.top}px`, left: `${contextMenuPosition.left}px` }"
        class="absolute z-30 bg-white border border-gray-200 rounded-lg p-2 shadow-xl w-52"
    >
      <!-- Menu for Volumes -->
      <template v-if="contextMenuItem?.type === 'volume'">
        <div class="context-menu-item"><i class="fa-solid fa-plus w-4"></i><span>新建章</span></div>
        <div class="context-menu-item"><i class="fa-solid fa-folder-plus w-4"></i><span>新建部</span></div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4"></i><span>批量分析</span></div>
        <div class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4"></i><span>批量生成</span></div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item"><i class="fa-solid fa-pencil w-4"></i><span>重命名</span></div>
        <div class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4"></i><span>删除卷</span></div>
      </template>
      <!-- Menu for Chapters -->
      <template v-else-if="contextMenuItem?.type === 'chapter'">
        <div class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4"></i><span>分析章节</span></div>
        <div class="context-menu-item"><i class="fa-solid fa-spell-check w-4"></i><span>润色章节</span></div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item"><i class="fa-solid fa-copy w-4"></i><span>创建副本</span></div>
        <div class="context-menu-item"><i class="fa-solid fa-pencil w-4"></i><span>重命名</span></div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4"></i><span>删除章节</span></div>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps<{ activeItem: any }>();
const emit = defineEmits(['update:activeItem']);

// --- Ref for Sidebar element ---
const sidebarRef = ref<HTMLElement | null>(null);

// --- Tab State ---
const activeInternalTab = ref('directory');
const internalTabs = [
  { id: 'directory', name: '目录' },
  { id: 'related', name: '相关' },
  { id: 'notes', name: '笔记' },
];

const setActiveItem = (item: any) => {
  emit('update:activeItem', item);
};

// --- Context Menu State ---
const isDirectoryContextMenuVisible = ref(false);
const contextMenuPosition = ref({ top: 0, left: 0 });
const contextMenuItem = ref<any>(null);

// --- Context Menu Handlers ---
const showDirectoryContextMenu = (item: any, event: MouseEvent) => {
  const sidebarRect = sidebarRef.value!.getBoundingClientRect();
  contextMenuItem.value = item;
  // Position relative to the sidebar component
  contextMenuPosition.value = { top: event.clientY - sidebarRect.top, left: event.clientX - sidebarRect.left };
  isDirectoryContextMenuVisible.value = true;
};

const hideDirectoryContextMenu = () => {
  isDirectoryContextMenuVisible.value = false;
  contextMenuItem.value = null;
};

// --- Lifecycle for Global Listener ---
onMounted(() => {
  window.addEventListener('click', hideDirectoryContextMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', hideDirectoryContextMenu);
});


// --- Mock Data ---

// 目录数据
const directory = ref([
  {
    id: 'vol-1',
    type: 'volume',
    title: '第一卷：星尘之始',
    content: '第一卷的大纲内容...',
    icon: 'fa-solid fa-book-open text-orange-500',
    chapters: [
      { id: 'ch-11', type: 'chapter', title: '第三章: 意外的信号', wordCount: 2105, content: '在寂静的太空中...', status: 'completed' },
      { id: 'ch-12', type: 'chapter', title: '第四章: 跃迁点', wordCount: 2415, content: '控制台的警报声...', status: 'editing' },
    ]
  }
]);

// 相关内容数据
const relatedItems = ref([
  {
    type: 'character',
    title: '角色',
    icon: 'fa-solid fa-users text-teal-500',
    color: 'teal',
    items: [
      { id: 'char-sheet', type: 'character_sheet', title: '角色大纲', icon: 'fa-regular fa-file-lines', content: '<h2>卡尔文·里德</h2><p><strong>定位：</strong>主角</p>...' },
      { id: 'char-calvin', type: 'character_profile', title: '卡尔文·里德', icon: 'fa-regular fa-user', content: '<h2>卡尔文·里德</h2><p><strong>年龄：</strong>35</p>...' },
      { id: 'char-aila', type: 'character_profile', title: '艾拉 (AILA)', icon: 'fa-regular fa-user', content: '<h2>艾拉 (AILA)</h2><p>第五代通用人工智能...</p>' },
    ]
  },
  {
    type: 'worldview',
    title: '世界观',
    icon: 'fa-solid fa-earth-americas text-sky-500',
    color: 'sky',
    items: [
      { id: 'world-overview', type: 'worldview_doc', title: '世界观总览', icon: 'fa-regular fa-file-lines', content: '<h3>时间背景</h3><p>公元2157年...</p>' },
    ]
  }
]);

// 笔记数据
const noteItems = ref([
  {
    id: 'note-1',
    type: 'note',
    title: '第四章情感转折点设计',
    timestamp: '今天 14:32',
    content: '卡尔文对"回家"的复杂情感需要更细腻的描写。目前的写法“心跳漏了一拍”有些 cliché，可以尝试更具体的生理和心理反应。思路1：通过回忆莉娜的片段来加强回家的渴望...'
  },
  {
    id: 'note-2',
    type: 'note',
    title: '跃迁点物理描述',
    timestamp: '今天 11:20',
    content: '查阅了相关资料，跃迁点可以描述为时空扭曲形成的漩涡状结构，周围伴随着强烈的引力潮汐。'
  }
]);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.line-clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.tab { --tab-bg: transparent; }

/* Styles for Context Menu (as seen in UI mock) */
.context-menu-item {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.context-menu-item:hover {
  background-color: #f3f4f6;
}
.context-menu-item.danger:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}
.context-menu-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}
</style>