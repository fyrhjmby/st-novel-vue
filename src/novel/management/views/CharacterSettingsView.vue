// =
// 文件: ..\src/novel/management/views/CharacterSettingsView.vue
//
<template>
  <div class="flex-1 flex overflow-hidden bg-[#FCFCFC]">
    <div class="w-1/3 max-w-sm border-r border-gray-100 p-4 flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-100">
        <button
            @click="managementStore.createNewCharacter"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
          创建新角色
        </button>
      </div>
      <div class="flex-grow overflow-y-auto pr-1 space-y-2 hide-scrollbar">
        <a
            v-for="character in characters"
            :key="character.id"
            href="#"
            @click.prevent="managementStore.setActiveCharacter(character.id)"
            class="flex items-center gap-3 p-3 rounded-lg group transition-colors"
            :class="{ 'bg-blue-50 border border-blue-200': activeCharacterId === character.id, 'hover:bg-gray-50': activeCharacterId !== character.id }"
        >
          <div class="w-10 h-10 rounded-full flex-shrink-0">
            <img v-if="character.avatar" :src="character.avatar" :alt="character.name" class="w-full h-full object-cover rounded-full">
            <div v-else class="w-full h-full rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[#374151] truncate text-sm">{{ character.name }}</p>
            <p class="text-xs text-[#6B7280] truncate">{{ character.identity }}</p>
          </div>
          <span v-if="character.status === 'editing'" class="text-xs font-medium px-2 py-1 rounded-md text-blue-600 bg-blue-100">编辑中</span>
        </a>
      </div>
    </div>
    <div v-if="activeCharacter" class="w-2/3 p-8 overflow-y-auto hide-scrollbar">
      <div class="space-y-6 max-w-3xl mx-auto">
        <div class="flex items-start gap-6">
          <div class="relative flex-shrink-0">
            <div class="w-24 h-24 rounded-full bg-gray-200">
              <img v-if="activeCharacter.avatar" :src="activeCharacter.avatar" :alt="activeCharacter.name" class="w-full h-full object-cover rounded-full" />
              <div v-else class="w-full h-full rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
            </div>
            <button class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 absolute bottom-0 right-0 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
            </button>
          </div>
          <div class="flex-grow space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#6B7280] mb-1.5">姓名</label>
              <input type="text" v-model="activeCharacter.name" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#6B7280] mb-1.5">身份/标签</label>
              <input type="text" v-model="activeCharacter.identity" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">性别</label><input type="text" v-model="activeCharacter.gender" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">年龄</label><input type="number" v-model="activeCharacter.age" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">阵营</label><input type="text" v-model="activeCharacter.faction" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#6B7280] mb-1.5">人物简介 (AI将参考此内容)</label>
          <textarea rows="4" v-model="activeCharacter.summary" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] leading-relaxed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#6B7280] mb-1.5">角色笔记 (仅自己可见)</label>
          <textarea rows="3" v-model="activeCharacter.notes" placeholder="记录一些灵感或不希望AI看到的细节..." class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
        </div>
        <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button @click="managementStore.deleteCharacter(activeCharacter.id)" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">删除角色</button>
          <button @click="managementStore.saveChanges" class="px-5 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">保存更改</button>
        </div>
      </div>
    </div>
    <div v-else class="w-2/3 p-8 flex items-center justify-center text-gray-400">
      <p>请从左侧选择一个角色进行编辑，或创建一个新角色。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useManagementStore } from '@/novel/management/stores/managementStore';
import { storeToRefs } from 'pinia';

const managementStore = useManagementStore();

const { characters, activeCharacterId, activeCharacter } = storeToRefs(managementStore);

onMounted(() => {
  // 假设我们正在管理 novelId 为 'novel-1' 的小说
  managementStore.fetchData('novel-1');
});
</script>