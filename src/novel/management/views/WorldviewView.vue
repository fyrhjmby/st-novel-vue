// =
// 文件: ..\src/novel/management/views/WorldviewView.vue
//

<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div v-if="worldviewCategories.length > 0" class="space-y-8 max-w-7xl mx-auto">
      <div v-for="category in worldviewCategories" :key="category.id">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <i :class="category.icon" class="w-5 h-5"></i>
          </div>
          <h2 class="text-base font-medium text-[#374151]">{{ category.name }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="item in category.items"
              :key="item.id"
              class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer"
          >
            <h3 class="font-medium text-[#374151] mb-1">{{ item.title }}</h3>
            <p class="text-sm text-[#9CA3AF] line-clamp-2">{{ item.description }}</p>
            <div class="mt-4 text-xs text-gray-400">更新于：{{ item.lastUpdated }}</div>
          </div>
          <button class="bg-white rounded-xl p-6 border border-dashed border-gray-200 hover:border-blue-400 transition-all hover:shadow-sm text-left group flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
            <div class="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
            </div>
            <h4 class="font-medium text-[#374151] mb-1">新建设定</h4>
            <p class="text-sm text-[#9CA3AF]">为此分类添加新条目</p>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500">
      正在加载世界观数据...
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useManagementStore } from '@/novel/management/stores/managementStore';
import { storeToRefs } from 'pinia';

const managementStore = useManagementStore();
const { worldviewCategories } = storeToRefs(managementStore);

onMounted(() => {
  // 假设我们正在管理 novelId 为 'novel-1' 的小说
  managementStore.fetchData('novel-1');
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>