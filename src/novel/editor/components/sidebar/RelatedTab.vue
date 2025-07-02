<template>
  <div class="related-tab-container">
    <div class="header">
      <h3 class="title">相关内容</h3>
      <button class="action-btn" title="添加新条目"><i class="fa-solid fa-plus fa-xs"></i></button>
    </div>
    <div class="search-bar">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input type="text" placeholder="搜索角色、地点、设定..." class="search-input">
    </div>
    <ul class="item-list">
      <li v-for="group in editorStore.relatedData" :key="group.type">
        <a href="#" class="group-header">
          <i class="fa-solid fa-chevron-down w-4 text-gray-400"></i>
          <i class="w-4 text-center" :class="group.icon"></i>
          <span>{{ group.title }}</span>
          <span class="count-badge">{{ group.items.length }}</span>
        </a>
        <ul class="sub-item-list">
          <li v-for="item in group.items" :key="item.id">
            <a
                href="#"
                @click.prevent="editorStore.setActiveItem(item.id)"
                class="sub-item"
                :class="editorStore.activeItemId === item.id ? `active text-${group.color}-800 border-${group.color}-200 bg-${group.color}-100` : ''"
            >
              <i class="w-4" :class="[item.icon, editorStore.activeItemId === item.id ? `text-${group.color}-600` : 'text-gray-400']"></i>
              <span class="truncate">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/novel/editor/stores/editorStore';
const editorStore = useEditorStore();
</script>

<style scoped>
.related-tab-container { padding: 1rem; overflow-y: auto; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
.search-bar { position: relative; margin-bottom: 1rem; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.875rem; }
.search-input { width: 100%; background: white; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.4rem 0.75rem 0.4rem 2.25rem; font-size: 0.875rem; outline: none; transition: all 0.2s; }
.search-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
.item-list, .sub-item-list { list-style: none; padding: 0; margin: 0; space-y: 0.25rem; }
.group-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; color: #374151; }
.group-header:hover { background-color: #F3F4F6; }
.count-badge { margin-left: auto; font-size: 0.75rem; color: #9CA3AF; font-weight: 400; }
.sub-item-list { padding-left: 1.5rem; margin-left: 0.375rem; border-left: 1px solid #E5E7EB; }
.sub-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; font-size: 0.875rem; color: #374151; }
.sub-item:hover { background-color: #F3F4F6; }
.sub-item.active { font-weight: 500; border: 1px solid; }
</style>