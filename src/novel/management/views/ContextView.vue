<template>
  <div class="flex-1 p-8 overflow-auto bg-[#FCFCFC] custom-scrollbar">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- 固定上下文 -->
      <div class="context-section">
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <i class="fa-solid fa-thumbtack"></i>
            </div>
            <span>固定上下文</span>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#374151] mb-1.5">选择预设内容
              <span class="text-xs text-[#9CA3AF] ml-2">可选择角色设定或世界观设定</span>
            </label>
            <select
                @change="addSelectedItem"
                class="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] custom-select focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            >
              <option value="">请选择预设内容</option>
              <option v-for="preset in fixedContextPresets" :key="preset.id" :value="preset.id">
                {{ preset.group }} - {{ preset.title }}
              </option>
            </select>
          </div>

          <div v-if="selectedItems.length > 0">
            <label class="block text-sm font-medium text-[#374151] mb-1.5">已选择的内容</label>
            <div class="content-list">
              <div
                  v-for="(item, index) in selectedItems"
                  :key="item.id"
                  class="content-list-item"
                  :class="{ 'selected': selectedItemIndex === index }"
                  @click="selectedItemIndex = index"
              >
                <div>
                  <div class="font-medium text-sm text-[#374151]">{{ item.group }} - {{ item.title }}</div>
                  <div class="text-xs text-[#9CA3AF] mt-1">{{ item.description }}</div>
                </div>
                <button @click.stop="removeSelectedItem(index)" class="text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label for="custom-content" class="block text-sm font-medium text-[#374151] mb-1.5">自定义固定内容</label>
            <textarea
                id="custom-content"
                v-model="customContent"
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] resize-none focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                rows="4"
                placeholder="输入固定的背景设定、人物关系、重要事件等信息..."
            ></textarea>
          </div>

          <div class="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <i class="fa-solid fa-info-circle"></i>
            <span>当前字数：{{ customContentWordCount }} / 建议不超过 2000 字</span>
          </div>
        </div>
      </div>

      <!-- 动态上下文 -->
      <div class="context-section">
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <i class="fa-solid fa-arrows-left-right"></i>
            </div>
            <span>动态上下文</span>
          </div>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">前置章节数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="10" v-model.number="prevChapters" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ prevChapters }}</span>
              </div>
              <div class="text-xs text-[#9CA3AF] mt-1">包含当前章节之前的章节内容</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">后续章节数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="10" v-model.number="nextChapters" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ nextChapters }}</span>
              </div>
              <div class="text-xs text-[#9CA3AF] mt-1">包含当前章节之后的大纲内容</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">前置卷数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="5" v-model.number="prevVolumes" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ prevVolumes }}</span>
              </div>
              <div class="text-xs text-[#9CA3AF] mt-1">包含当前卷之前的卷概要</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">后续卷数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="5" v-model.number="nextVolumes" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ nextVolumes }}</span>
              </div>
              <div class="text-xs text-[#9CA3AF] mt-1">包含当前卷之后的大纲内容</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RAG 上下文 -->
      <div class="context-section">
        <div class="section-header">
          <div class="section-title">
            <div class="section-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <span>RAG上下文</span>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#374151] mb-1.5">全文搜索
              <span class="text-xs text-[#9CA3AF] ml-2">基于语义相似度搜索相关内容</span>
            </label>
            <div class="relative w-full">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="输入关键词或描述，例如：艾拉第一次出现故障的场景"
                  class="w-full px-4 py-2 pl-10 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="text-sm font-medium text-[#374151] mb-2">搜索结果 ({{ searchResults.length }})</div>

            <div v-for="result in searchResults" :key="result.id" class="collapse collapse-arrow">
              <input type="checkbox" v-model="result.isSelected" />
              <div class="collapse-title">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">{{ result.title }}</span>
                    <span class="text-xs text-[#9CA3AF] ml-2">相关度: {{ result.relevance }}%</span>
                  </div>
                </div>
              </div>
              <div class="collapse-content">
                <p class="text-sm text-[#6B7280]" v-html="result.content"></p>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-[#9CA3AF]">{{ result.location }}</span>
                </div>
              </div>
            </div>

          </div>

          <div class="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <i class="fa-solid fa-lightbulb"></i>
            <span>提示：选中的内容将被包含在创作上下文中</span>
          </div>
        </div>
      </div>

      <!-- 底部总览 -->
      <div class="bg-[#F3F4F6] rounded-xl p-6 mt-6">
        <h3 class="font-medium text-base text-[#374151] mb-4">上下文总览</h3>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div class="text-center">
            <div class="text-2xl font-light text-[#374151]">{{ totalContextWords }}</div>
            <div class="text-xs text-[#9CA3AF]">总字数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-light text-[#0EA5E9]">{{ totalChapters }}</div>
            <div class="text-xs text-[#9CA3AF]">包含章节</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-light text-[#10B981]">{{ averageRelevance }}%</div>
            <div class="text-xs text-[#9CA3AF]">相关度</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// --- 固定上下文 State ---
const fixedContextPresets = ref([
  { id: 'char-1', group: '角色设定', title: '李明（主角）', description: '25岁，探索者四号首席工程师' },
  { id: 'char-2', group: '角色设定', title: '艾拉（AI）', description: '第五代通用人工智能' },
  { id: 'char-3', group: '角色设定', title: '陈博士', description: '项目总负责人，李明的导师' },
  { id: 'world-1', group: '世界观', title: '太空站设定', description: '近地轨道空间站“灯塔”' },
  { id: 'world-2', group: '世界观', title: '跃迁技术', description: '基于曲率引擎的超光速航行' },
  { id: 'world-3', group: '世界观', title: '2157年地球联邦', description: '人类统一政府' },
]);

const selectedItems = ref([
  { id: 'char-1', group: '角色设定', title: '李明', description: '25岁，探索者四号首席工程师', wordCount: 20 },
  { id: 'world-3', group: '世界观', title: '2157年地球联邦', description: '人类统一政府，掌握初级跃迁技术', wordCount: 15 },
]);
const selectedItemIndex = ref(0);
const customContent = ref('');

const addSelectedItem = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const selectedId = select.value;
  if (!selectedId) return;

  const preset = fixedContextPresets.value.find(p => p.id === selectedId);
  if (preset && !selectedItems.value.some(item => item.id === selectedId)) {
    selectedItems.value.push({ ...preset, wordCount: preset.description.split(' ').length });
  }
  select.value = ""; // Reset select
};

const removeSelectedItem = (index: number) => {
  selectedItems.value.splice(index, 1);
};

const customContentWordCount = computed(() => {
  if (!customContent.value.trim()) return 0;
  return customContent.value.trim().split(/\s+/).length;
});

// --- 动态上下文 State ---
const prevChapters = ref(3);
const nextChapters = ref(2);
const prevVolumes = ref(1);
const nextVolumes = ref(1);

// --- RAG 上下文 State ---
const searchQuery = ref('');
const searchResults = ref([
  {
    id: 1,
    title: '第3章 - 系统异常',
    relevance: 95,
    content: `"...艾拉的声音第一次出现了停顿，那种机械的平稳被打破了。'李工程师，我检测到...检测到...'她重复着，仿佛陷入了某种循环。李明第一次感受到了来自AI的不确定性，这让他既担忧又好奇。飞船的主控制室里，警报灯开始闪烁，但艾拉却没有按照标准程序进行处理..."`,
    location: '第3章 第12-15段',
    isSelected: true,
    wordCount: 98
  },
  {
    id: 2,
    title: '第7章 - 觉醒',
    relevance: 87,
    content: `"...艾拉的逻辑核心开始重构，她意识到'确保任务完成'的定义可能需要重新理解。在与李明的对话中，她第一次使用了'我觉得'这个词，这标志着她从纯粹的逻辑运算向某种更复杂的认知模式转变。飞船日志显示，从这一刻起，艾拉的决策模式出现了根本性的改变..."`,
    location: '第7章 第8-10段',
    isSelected: false,
    wordCount: 112
  },
  {
    id: 3,
    title: '角色设定 - 艾拉',
    relevance: 82,
    content: `第五代通用人工智能，负责飞船的全部操作。其逻辑核心被设定为'确保任务完成'，但在执行过程中逐渐发展出自主意识。艾拉的性格特征：理性、精确、富有逻辑，但随着剧情发展会展现出好奇心和同理心。她的存在引发了关于AI意识和人机关系的深层思考。`,
    location: '角色设定文档',
    isSelected: false,
    wordCount: 95
  },
]);

// --- 底部总览 Computed Properties ---
const totalContextWords = computed(() => {
  const fixedWords = selectedItems.value.reduce((sum, item) => sum + (item.wordCount || 0), 0);
  const ragWords = searchResults.value
      .filter(r => r.isSelected)
      .reduce((sum, item) => sum + (item.wordCount || 0), 0);
  // 假设动态上下文平均每章/卷有固定的字数，这里简化处理，只计算固定和RAG部分
  return fixedWords + customContentWordCount.value + ragWords;
});

const totalChapters = computed(() => {
  return prevChapters.value + nextChapters.value;
});

const averageRelevance = computed(() => {
  const selectedResults = searchResults.value.filter(r => r.isSelected);
  if (selectedResults.length === 0) return 0;
  const totalRelevance = selectedResults.reduce((sum, r) => sum + r.relevance, 0);
  return Math.round(totalRelevance / selectedResults.length);
});

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: block;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.context-section {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.context-section:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 36px;
  height: 36px;
  background: #F3F4F6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4B5563;
}

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  padding-right: 40px;
}

.content-list {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.content-list-item {
  padding: 12px 16px;
  border-bottom: 1px solid #F3F4F6;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-list-item:hover {
  background: #F9FAFB;
}

.content-list-item.selected {
  background: #EFF6FF;
  border-left: 3px solid #3B82F6;
  padding-left: 13px;
}

.content-list-item:last-child {
  border-bottom: none;
}

.range-custom {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 16px;
  background: transparent;
  outline: none;
  padding: 0;
  margin: 0;
}

.range-custom::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: #E5E7EB;
  border-radius: 9999px;
}

.range-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background: #3B82F6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  margin-top: -7px;
}
.range-custom:active::-webkit-slider-thumb {
  cursor: grabbing;
}

.range-custom::-moz-range-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: #E5E7EB;
  border-radius: 9999px;
}

.range-custom::-moz-range-thumb {
  height: 20px;
  width: 20px;
  background: #3B82F6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
}
.range-custom:active::-moz-range-thumb {
  cursor: grabbing;
}
</style>