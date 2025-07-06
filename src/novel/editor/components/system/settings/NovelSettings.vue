<template>
  <div class="flex-1 p-8 overflow-auto custom-scrollbar bg-[#FCFCFC]">
    <div v-if="novelMetadata" class="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="col-span-2 bg-white p-8 space-y-6 rounded-xl border border-gray-100">
        <h3 class="text-base font-medium text-[#374151]">基本信息</h3>

        <div class="space-y-2">
          <label class="text-sm font-medium text-[#374151] block">小说封面</label>
          <div class="flex items-center gap-4">
            <img :src="novelMetadata.cover" class="w-24 h-32 object-cover rounded-lg shadow-sm" alt="Cover">
            <div>
              <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">更换图片</button>
              <p class="text-xs text-[#9CA3AF] mt-2">JPG, PNG, GIF, 不超过 5MB</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="novel-title" class="text-sm font-medium text-[#374151] block">小说标题</label>
          <input type="text" id="novel-title" v-model="novelMetadata.title" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div class="space-y-2">
          <label for="novel-desc" class="text-sm font-medium text-[#374151] block">小说简介</label>
          <textarea id="novel-desc" rows="4" v-model="novelMetadata.description" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151] block">类型标签</label>
            <div class="flex flex-wrap gap-2 items-center">
              <div v-for="(tag, index) in novelMetadata.tags" :key="index" class="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-full" :class="tag.class">
                <span>{{ tag.text }}</span>
                <button @click="editorStore.removeTag(index)" class="hover:opacity-75">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <button @click="editorStore.addTag" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#6B7280] rounded-full text-sm font-medium transition-colors">+ 添加</button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151] block">创作状态</label>
            <select v-model="novelMetadata.status" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <option>连载中</option>
              <option>已完结</option>
              <option>暂停更新</option>
            </select>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button @click="editorStore.fetchNovelData('novel-1')" class="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">重置</button>
          <button @click="editorStore.saveMetadata" class="px-5 py-2 bg-[#4B5563] hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">保存更改</button>
        </div>
      </div>

      <div class="col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-100">
          <h3 class="text-base font-medium text-[#374151]">参考内容管理</h3>
          <p class="text-sm text-[#9CA3AF] mt-1 mb-4">将其他作品作为参考，AI会借鉴其风格</p>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=100" class="w-8 h-10 object-cover rounded flex-shrink-0" alt="Reference Book">
                <span class="text-sm font-medium text-[#374151] truncate">银河帝国</span>
              </div>
              <button class="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

          <button class="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-4 text-sm font-medium text-[#9CA3AF] hover:border-blue-500 hover:text-blue-500 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
            <span>添加参考作品</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500">
      正在加载小说设置...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { storeToRefs } from 'pinia';

const editorStore = useEditorStore();
const { novelMetadata } = storeToRefs(editorStore);

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
</style>