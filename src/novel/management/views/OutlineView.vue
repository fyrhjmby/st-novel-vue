<template>
  <div class="flex-1 flex overflow-hidden">
    <!-- 左侧大纲树 -->
    <aside class="w-80 bg-[#FAFAFA] border-r border-gray-100 p-6 flex flex-col flex-shrink-0">
      <div class="mb-4">
        <h3 class="text-sm font-medium text-[#374151] mb-3">大纲结构</h3>
        <div class="flex items-center gap-2 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            3卷
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
             <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            24章
          </span>
        </div>
      </div>

      <div class="outline-tree overflow-y-auto hide-scrollbar flex-1">
        <!-- 整体大纲 -->
        <div class="tree-item" :class="{ 'active': activeSection === 'overall' }" @click="showOutlineSection('overall')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 6a2 2 0 012-2h5l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
          <span>整体大纲</span>
        </div>

        <!-- 卷 -->
        <div v-for="volume in outlineData" :key="volume.id" class="mt-3">
          <div class="tree-item" :class="{ 'active': activeSection === volume.id }" @click="toggleVolume(volume.id)">
            <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-90': volume.expanded }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 22V5z"></path></svg>
            <span class="font-medium">{{ volume.title }}</span>
          </div>
          <div class="tree-indent" v-show="volume.expanded">
            <div
                v-for="chapter in volume.chapters"
                :key="chapter.id"
                class="tree-item"
                :class="{ 'active': activeSection === chapter.id }"
                @click="showOutlineSection(chapter.id)">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>{{ chapter.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧编辑区 -->
    <div class="flex-1 p-8 overflow-auto hide-scrollbar bg-[#FCFCFC]">
      <div class="max-w-4xl mx-auto">
        <!-- 编辑器占位符 -->
        <div class="outline-editor p-8 bg-white rounded-xl border border-gray-200 space-y-8">
          <div v-if="activeSection === 'overall'">
            <h2 class="section-title">整体大纲</h2>
            <textarea class="outline-textarea" rows="8">《星际漫游者》是一个关于孤独、觉醒与回归的科幻故事...</textarea>
          </div>
          <div v-if="activeSection === 'vol1'">
            <h2 class="section-title">第一卷：启程</h2>
            <textarea class="outline-textarea" rows="8">第一卷主要建立故事背景和人物关系...</textarea>
          </div>
          <div v-if="activeSection === 'ch1-1'">
            <h2 class="section-title">第1章：最后的信号</h2>
            <textarea class="outline-textarea" rows="8">章节目标：建立主角李明的人物形象...</textarea>
          </div>
          <div class="text-center text-gray-400" v-if="!activeSection">
            <p>请在左侧选择一个大纲节点进行编辑</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeSection = ref('overall');

const outlineData = ref([
  {
    id: 'vol1',
    title: '第一卷：启程',
    expanded: true,
    chapters: [
      { id: 'ch1-1', title: '第1章：最后的信号' },
      { id: 'ch1-2', title: '第2章：艾拉' },
      { id: 'ch1-3', title: '第3章：系统异常' },
    ]
  },
  {
    id: 'vol2',
    title: '第二卷：觉醒',
    expanded: false,
    chapters: []
  },
  {
    id: 'vol3',
    title: '第三卷：归途',
    expanded: false,
    chapters: []
  },
]);

function showOutlineSection(sectionId: string) {
  activeSection.value = sectionId;
}

function toggleVolume(volumeId: string) {
  const volume = outlineData.value.find(v => v.id === volumeId);
  if (volume) {
    volume.expanded = !volume.expanded;
  }
  showOutlineSection(volumeId);
}
</script>

<style scoped>
.outline-tree .tree-item {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
}

.outline-tree .tree-item:hover {
  background: #F3F4F6;
}

.outline-tree .tree-item.active {
  background: #EFF6FF;
  color: #1D4ED8;
  font-weight: 500;
}

.outline-tree .tree-indent {
  margin-left: 24px;
  padding-left: 14px;
  border-left: 1px solid #E5E7EB;
  margin-top: 4px;
  space-y: 2px;
}

.outline-editor .section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.outline-editor .outline-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  background: #FAFAFA;
  transition: all 0.2s ease;
  outline: none;
}

.outline-editor .outline-textarea:focus {
  border-color: #3B82F6;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>