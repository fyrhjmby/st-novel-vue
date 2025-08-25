<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white rounded-xl p-8 border border-gray-100 shadow-sm">

      <!-- 文件上传区域 -->
      <div
          @click="triggerFileSelect"
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="handleFileDrop"
          :class="['border-2 border-dashed border-gray-200 rounded-xl p-12 text-center transition-colors cursor-pointer', dragOver ? 'border-blue-400 bg-gray-50/50' : 'hover:border-blue-400 hover:bg-gray-50/50']"
      >
        <input type="file" ref="fileInput" @change="handleFileSelect" class="hidden" accept=".txt,.md">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 13V21M15 16L12 13L9 16"/>
        </svg>
        <h3 class="text-lg font-medium text-[#374151]">将文件拖拽至此</h3>
        <p class="text-sm text-[#6B7280] mt-1">或</p>
        <button @click.stop="triggerFileSelect" class="mt-4 px-6 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">
          选择文件
        </button>
        <p v-if="fileName" class="text-sm text-blue-600 mt-4 font-medium">{{ fileName }}</p>
        <p v-else class="text-xs text-gray-400 mt-4">支持 .txt, .md</p>
      </div>

      <!-- 导入设置区域 -->
      <div class="mt-8 text-left space-y-6 w-full">
        <div>
          <h4 class="text-base font-medium text-[#374151] mb-2">章节解析规则</h4>
          <div class="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <p class="text-sm font-medium text-[#374151]">按空行分割章节</p>
            <p class="text-xs text-[#9CA3AF] mt-1">将使用一个或多个连续的空行作为章节的分割符。</p>
          </div>
        </div>

        <div>
          <h4 class="text-base font-medium text-[#374151] mb-2">章节分卷设置</h4>
          <div class="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <label for="chapters-per-volume" class="text-sm font-medium text-[#374151] block mb-2">每卷包含的章节数</label>
            <input type="number" id="chapters-per-volume" v-model.number="chaptersPerVolume" min="1" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
            <p class="text-xs text-[#9CA3AF] mt-2">导入的章节将按此数量自动分卷。</p>
          </div>
        </div>
      </div>

      <!-- 导入操作 -->
      <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
        <button
            @click="handleImport"
            :disabled="!uploadedFileContent"
            class="px-8 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path></svg>
          <span>开始导入</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNovelStore } from '@/novel/dashboard/stores/novelStore';
import { importNovelProject } from '@/novel/services/novelProjectService';
import { parseNovelText } from '@/novel/importer/services/novelParser';
import type { NovelDashboardItem, NovelCategory } from '@/novel/types';

const router = useRouter();
const novelStore = useNovelStore();

const fileInput = ref<HTMLInputElement | null>(null);
const fileName = ref('');
const uploadedFileContent = ref<string | null>(null);
const dragOver = ref(false);
const chaptersPerVolume = ref(10);
const selectedCategory = ref<NovelCategory>('都市');
const availableCategories: NovelCategory[] = ['科幻', '奇幻', '悬疑', '恐怖', '都市', '言情', '历史'];

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    readFile(file);
  }
};

const handleFileDrop = (event: DragEvent) => {
  dragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && (file.type === 'text/plain' || file.type === 'text/markdown')) {
    readFile(file);
  } else {
    alert('请拖放 .txt 或 .md 文件');
  }
};

const readFile = (file: File) => {
  fileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedFileContent.value = e.target?.result as string;
  };
  reader.onerror = () => {
    alert('文件读取失败');
    uploadedFileContent.value = null;
    fileName.value = '';
  };
  reader.readAsText(file);
};

const handleImport = async () => {
  if (!uploadedFileContent.value) {
    alert('没有文件内容可供导入。');
    return;
  }
  if (!selectedCategory.value) {
    alert('请选择小说分类。');
    return;
  }

  try {
    const directoryData = parseNovelText(uploadedFileContent.value, {
      chaptersPerVolume: chaptersPerVolume.value || 10,
    });

    const novelTitle = fileName.value.replace(/\.(txt|md)$/i, '') || '导入的小说';

    const newProject = await importNovelProject({
      title: novelTitle,
      description: '从文件导入的小说',
      category: selectedCategory.value,
      directoryData,
    });

    const newNovelForDashboard: NovelDashboardItem = {
      id: newProject.metadata.id,
      title: newProject.metadata.title,
      description: newProject.metadata.description,
      category: selectedCategory.value,
      cover: newProject.metadata.cover,
      status: { text: '编辑中', class: 'bg-green-500/90' },
      tags: newProject.metadata.tags,
      chapters: directoryData.reduce((acc, vol) => acc + vol.chapters.length, 0),
      lastUpdated: '刚刚',
    };
    novelStore.addNovel(newNovelForDashboard);

    router.push(`/novel/editor?id=${newProject.metadata.id}`);
  } catch (error) {
    console.error('Failed to import novel:', error);
    alert('导入失败，请检查文件内容或联系管理员。');
  }
};
</script>

<style scoped>
</style>