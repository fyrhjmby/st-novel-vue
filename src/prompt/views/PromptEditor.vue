<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-6 flex items-center justify-between border-b border-gray-200/70 bg-white flex-shrink-0">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-gray-800">{{ isEditMode ? '编辑提示词' : '创建新提示词' }}</h1>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn btn-secondary" @click="router.back()">
          取消
        </button>
        <button class="btn btn-primary" @click="handleSave" :disabled="promptStore.isLoading">
          <svg v-if="promptStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEditMode ? '保存更新' : '发布提示词' }}
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 px-8 py-8 overflow-y-auto bg-gray-50/50">
        <div class="card p-6 mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-6">基本信息</h3>
          <div class="space-y-6">
            <div>
              <label class="form-label">标题 <span class="text-red-500">*</span></label>
              <input type="text" v-model="promptForm.title" class="form-input w-full h-11 px-4 text-sm" placeholder="给你的提示词起个响亮的名字">
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="form-label">分类 <span class="text-red-500">*</span></label>
                <input type="text" v-model="promptForm.tag" class="form-input w-full h-11 px-4 text-sm" placeholder="如：沟通、编程">
              </div>
              <div>
                <label class="form-label">状态</label>
                <select v-model="promptForm.status" class="form-select w-full h-11 px-4 pr-10 text-sm appearance-none">
                  <option value="公开">公开</option>
                  <option value="私有">私有</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">简介 <span class="text-red-500">*</span></label>
              <textarea rows="3" v-model="promptForm.description" class="form-textarea w-full p-4 text-sm resize-y" placeholder="用一句话描述你的提示词能做什么"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="w-80 border-l border-gray-200/70 bg-white p-6 flex-shrink-0 overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-800 mb-4">实时预览</h3>
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 text-sm mb-1 break-words">{{ promptForm.title || '提示词标题' }}</h4>
              <span v-if="promptForm.tag" class="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{{ promptForm.tag }}</span>
            </div>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed break-words">{{ promptForm.description || '这里是提示词的简介...' }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePromptStore } from '@/prompt/stores/promptStore';
import type { Prompt } from '@/prompt/types/prompt';

const route = useRoute();
const router = useRouter();
const promptStore = usePromptStore();

const promptId = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!promptId.value);

const promptForm = reactive<Partial<Prompt>>({
  title: '',
  description: '',
  tag: '',
  status: '私有',
  author: '李欣然', // 模拟当前登录用户
  icon: `<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`,
  iconBgClass: 'bg-blue-50',
  tagClass: 'text-[#10B981] bg-green-50',
  authorAvatarClass: 'bg-gradient-to-br from-indigo-100 to-purple-100',
});

onMounted(async () => {
  if (isEditMode.value && promptId.value) {
    await promptStore.fetchPromptById(promptId.value);
    if (promptStore.currentPrompt) {
      Object.assign(promptForm, promptStore.currentPrompt);
    }
  }
});

const handleSave = async () => {
  try {
    if (isEditMode.value && promptId.value) {
      await promptStore.updatePrompt(promptId.value, promptForm);
    } else {
      await promptStore.addPrompt(promptForm as Omit<Prompt, 'id'>);
    }
    router.push({ name: 'prompt-my' });
  } catch (error) {
    console.error('保存失败:', error);
    // 可以在这里添加用户提示，例如使用一个toast通知
  }
};
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
}
.form-label {
  @apply text-sm font-medium text-gray-700 block mb-2;
}
.form-input, .form-select, .form-textarea {
  @apply bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 ease-in-out;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  @apply outline-none border-blue-600 ring-2 ring-blue-600/20;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out px-4 py-2 text-sm;
}
.btn-primary {
  @apply bg-gray-800 text-white shadow-sm hover:bg-gray-900 disabled:bg-gray-400;
}
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50;
}
</style>