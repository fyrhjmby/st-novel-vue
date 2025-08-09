<template>
  <div class="flex-1 p-8 overflow-auto custom-scrollbar bg-[#FCFCFC]">
    <div v-if="settingsStore.novelMetadata" class="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="col-span-2 bg-white p-8 space-y-6 rounded-xl border border-gray-100">
        <h3 class="text-base font-medium text-[#374151]">基本信息</h3>

        <div class="space-y-2">
          <label class="text-sm font-medium text-[#374151] block">小说封面</label>
          <div class="flex items-center gap-4">
            <img :src="settingsStore.novelMetadata.cover" class="w-24 h-32 object-cover rounded-lg shadow-sm" alt="Cover">
            <div>
              <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">更换图片</button>
              <p class="text-xs text-[#9CA3AF] mt-2">JPG, PNG, GIF, 不超过 5MB</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="novel-title" class="text-sm font-medium text-[#374151] block">小说标题</label>
          <input type="text" id="novel-title" v-model="settingsStore.novelMetadata.title" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div class="space-y-2">
          <label for="novel-desc" class="text-sm font-medium text-[#374151] block">小说简介</label>
          <textarea id="novel-desc" rows="4" v-model="settingsStore.novelMetadata.description" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151] block">类型标签</label>
            <div class="flex flex-wrap gap-2 items-center">
              <div v-for="(tag, index) in settingsStore.novelMetadata.tags" :key="index" class="flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-full" :class="tag.class">
                <span>{{ tag.text }}</span>
                <button @click="settingsStore.removeTag(index)" class="hover:opacity-75">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <button @click="settingsStore.addTag" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-[#6B7280] rounded-full text-sm font-medium transition-colors">+ 添加</button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-[#374151] block">创作状态</label>
            <select v-model="settingsStore.novelMetadata.status" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <option>连载中</option>
              <option>已完结</option>
              <option>暂停更新</option>
            </select>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button @click="settingsStore.resetMetadata" class="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">重置</button>
          <button @click="settingsStore.saveMetadata" class="px-5 py-2 bg-[#4B5563] hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">保存更改</button>
        </div>
      </div>

      <div class="col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-100">
          <h3 class="text-base font-medium text-[#374151]">参考内容管理</h3>
          <p class="text-sm text-[#9CA3AF] mt-1 mb-4">将其他作品作为参考，AI会借鉴其风格</p>

          <div class="space-y-3">
            <div v-for="novel in settingsStore.referencedNovels" :key="novel.metadata.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-center gap-3 overflow-hidden">
                <img :src="novel.metadata.cover" class="w-8 h-10 object-cover rounded flex-shrink-0" alt="Reference Book">
                <span class="text-sm font-medium text-[#374151] truncate">{{ novel.metadata.title }}</span>
              </div>
              <button @click="settingsStore.removeReferenceNovel(novel.metadata.id)" class="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <p v-if="settingsStore.referencedNovels.length === 0" class="text-center text-sm text-gray-400 py-4">暂无参考作品</p>
          </div>

          <div class="mt-4 relative">
            <select @change="handleReferenceSelect" class="w-full appearance-none text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <option value="" disabled selected>-- 添加参考作品 --</option>
              <option v-for="novel in settingsStore.availableReferenceNovels" :key="novel.metadata.id" :value="novel.metadata.id">
                {{ novel.metadata.title }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500">
      正在加载小说设置...
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNovelSettingsStore } from '@/novel/editor/stores/novelSettingsStore';

const settingsStore = useNovelSettingsStore();

const handleReferenceSelect = (event: Event) => {
  const selectElement = event.target as HTMLSelectElement;
  const selectedId = selectElement.value;
  if (selectedId) {
    settingsStore.addReferenceNovel(selectedId);
    selectElement.value = ''; // Reset the select after adding
  }
};

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