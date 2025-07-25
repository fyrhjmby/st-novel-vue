<template>
  <div class="setting-page-wrapper custom-scrollbar">
    <div class="page-header">
      <h2 class="page-title">上下文管理</h2>
      <p class="page-description">配置AI任务执行时如何处理上下文信息，以获得更精准的生成结果。</p>
    </div>

    <div class="setting-group">
      <div class="setting-item">
        <label for="needs-preview" class="setting-label">执行前预览</label>
        <div class="setting-control">
          <div class="flex items-center">
            <input id="needs-preview" type="checkbox" v-model="uiStore.uiState.needsPreview" class="setting-checkbox" />
            <label for="needs-preview" class="ml-3 font-medium text-gray-700">启用AI任务执行前预览</label>
          </div>
          <p class="setting-description">
            启用后，在编辑器或目录中触发AI任务时，会弹出一个上下文预览窗口供您确认。
          </p>
        </div>
      </div>
    </div>

    <div class="setting-group mt-4">
      <div class="setting-item">
        <label class="setting-label">固定上下文</label>
        <div class="setting-control space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#374151] mb-1.5">选择预设内容
              <span class="text-xs text-[#9CA3AF] ml-2">可选择角色设定或世界观设定</span>
            </label>
            <select
                @change="addSelectedItem"
                class="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] custom-select focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            >
              <option value="">请选择预设内容...</option>
              <option v-for="preset in fixedContextPresets" :key="preset.id" :value="preset.id">
                {{ preset.group }} - {{ preset.title }}
              </option>
            </select>
          </div>

          <div v-if="selectedItems.length > 0">
            <label class="block text-sm font-medium text-[#374151] mb-1.5">已选择的内容</label>
            <div class="content-list">
              <div v-for="(item, index) in selectedItems" :key="item.id" class="content-list-item">
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
                v-model="uiStore.uiState.customContextContent"
                class="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] resize-none focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                rows="4"
                placeholder="输入固定的背景设定、人物关系、重要事件等AI必须参考的信息..."
            ></textarea>
            <p class="setting-description mt-2">这里的内容将始终被添加到AI任务的上下文中。</p>
          </div>
        </div>
      </div>

      <div class="setting-item">
        <label class="setting-label">动态上下文</label>
        <div class="setting-control space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">前置章节数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="10" v-model.number="uiStore.uiState.dynamicContextSettings.prevChapters" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ uiStore.uiState.dynamicContextSettings.prevChapters }}</span>
              </div>
              <p class="setting-description mt-1">自动包含当前章节之前的N个章节内容。</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#374151] mb-1.5">后续章节数</label>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="10" v-model.number="uiStore.uiState.dynamicContextSettings.nextChapters" class="range-custom flex-1"/>
                <span class="text-sm font-medium w-8 text-center text-[#374151]">{{ uiStore.uiState.dynamicContextSettings.nextChapters }}</span>
              </div>
              <p class="setting-description mt-1">自动包含当前章节之后N个章节的大纲。</p>
            </div>
          </div>
        </div>
      </div>

      <div class="setting-item">
        <label for="rag-context" class="setting-label">RAG 智能检索</label>
        <div class="setting-control">
          <div class="flex items-center">
            <input id="rag-context" type="checkbox" v-model="uiStore.uiState.isRagEnabled" class="setting-checkbox" />
            <label for="rag-context" class="ml-3 font-medium text-gray-700">启用RAG智能检索</label>
          </div>
          <p class="setting-description">
            启用后，AI任务将根据当前上下文自动从您的整个知识库（包括所有章节、设定、笔记）中检索最相关的信息片段并注入到上下文中。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '../../../stores/uiStore';
import { useRelatedContentStore } from '../../../stores/relatedContentStore';

const uiStore = useUIStore();
const relatedContentStore = useRelatedContentStore();

const selectedItems = computed(() => uiStore.uiState.selectedContextItems);

const fixedContextPresets = computed(() => {
  const presets: { id: string; group: string; title: string; description: string; content: string }[] = [];
  const settingsNode = relatedContentStore.relatedData.find(n => n.id === 'settings');

  if (settingsNode && settingsNode.children) {
    settingsNode.children.forEach(group => {
      if (group.children) {
        group.children.forEach(item => {
          if (item.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.content;
            const description = tempDiv.querySelector('p')?.textContent || item.title;
            presets.push({
              id: item.id,
              group: group.title,
              title: item.title,
              description: description.substring(0, 100) + '...',
              content: item.content
            });
          }
        });
      }
    });
  }
  return presets;
});

const addSelectedItem = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const selectedId = select.value;
  if (!selectedId) return;

  const preset = fixedContextPresets.value.find(p => p.id === selectedId);
  if (preset) {
    uiStore.addFixedContextItem(preset);
  }
  select.value = ""; // Reset select after choosing
};

const removeSelectedItem = (index: number) => {
  uiStore.removeFixedContextItem(index);
};
</script>

<style scoped>
.setting-page-wrapper { padding: 1rem 2rem 4rem; max-width: 56rem; margin: 0 auto; overflow-y: auto; height: 100%; }
.custom-scrollbar::-webkit-scrollbar { display: block; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.page-header { padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: #1F2937; }
.page-description { color: #6B7280; margin-top: 0.25rem; }
.setting-group { display: flex; flex-direction: column; }
.setting-item { display: grid; grid-template-columns: 12rem 1fr; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid #E5E7EB; }
.setting-item:last-child { border-bottom: none; }
.setting-label { font-size: 0.875rem; font-weight: 500; color: #374151; padding-top: 0.5rem; }
.setting-control { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-description { color: #6B7280; font-size: 0.875rem; line-height: 1.6; }
.setting-checkbox { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; border: 1px solid #D1D5DB; color: #2563EB; }
.range-custom { -webkit-appearance: none; appearance: none; width: 100%; height: 16px; background: transparent; outline: none; padding: 0; margin: 0; }
.range-custom::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; background: #E5E7EB; border-radius: 9999px; }
.range-custom::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 20px; width: 20px; background: #3B82F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); cursor: grab; margin-top: -7px; }
.custom-select { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7 7L13 1' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; padding-right: 40px; }
.content-list { border: 1px solid #E5E7EB; border-radius: 8px; max-height: 200px; overflow-y: auto; }
.content-list-item { padding: 12px 16px; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
.content-list-item:last-child { border-bottom: none; }
</style>