<template>
  <div
      v-if="visible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
  >
    <!-- [修复] 根据传入节点的类型 (volume or chapter) 显示不同的菜单 -->
    <template v-if="node?.type === 'volume'">
      <p class="menu-title">批量操作</p>
      <div @click="handleAIAction('分析', node)" class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i><span>批量分析章节</span></div>
      <div @click="handleAIAction('续写', node)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>批量生成章节</span></div>
      <div class="context-menu-divider"></div>
      <p class="menu-title">目录管理</p>
      <div class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建章节</span></div>
      <div class="context-menu-item"><i class="fa-solid fa-folder-plus w-4 text-center"></i><span>新建子卷</span></div>
      <div class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除卷</span></div>
    </template>
    <template v-else-if="node?.type === 'chapter'">
      <p class="menu-title">AI 助手</p>
      <div @click="handleAIAction('分析', node)" class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i><span>分析内容</span></div>
      <div @click="handleAIAction('续写', node)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>生成内容</span></div>
      <div class="context-menu-divider"></div>
      <p class="menu-title">文件操作</p>
      <div class="context-menu-item"><i class="fa-solid fa-copy w-4 text-center"></i><span>创建副本</span></div>
      <div class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除章节</span></div>
    </template>
    <!-- 可以为其他类型如 note, character_profile 等添加更多菜单项 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { TreeNode } from './TreeView.vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';

const aiTaskStore = useAITaskStore();
const editorStore = useEditorStore();
const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const node = ref<TreeNode | null>(null);

// [修复] show 方法现在接收 TreeNode 和 MouseEvent
const show = (event: MouseEvent, targetNode: TreeNode) => {
  node.value = targetNode;
  visible.value = true;
  position.value.x = event.clientX;
  position.value.y = event.clientY;
};

const hide = () => {
  visible.value = false;
  node.value = null;
};

// [新增] 处理AI操作
const handleAIAction = (taskType: '续写' | '润色' | '分析', node: TreeNode) => {
  if (!node) return;
  // 要对一个非当前激活的节点执行任务，需要先将其设为激活项
  // 这样 AI 任务才能获取到正确的内容
  editorStore.setActiveItem(node.id);
  // 使用延时确保 activeItem 的计算属性更新完毕
  setTimeout(() => {
    aiTaskStore.startNewTask(taskType);
    hide();
  }, 50);
}

// [修复] 添加点击和右键全局监听器来关闭菜单
onMounted(() => {
  window.addEventListener('click', hide);
  window.addEventListener('contextmenu', (e) => {
    // 只有当右键点击的不是菜单本身时才关闭
    if (!(e.target as HTMLElement).closest('.context-menu')) {
      hide();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('click', hide);
  window.removeEventListener('contextmenu', hide);
});

// Expose show/hide methods to parent component
defineExpose({ show, hide });
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem; /* 12px */
  padding: 0.5rem; /* 8px */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  min-width: 14rem; /* 224px */
}
.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  border-radius: 0.5rem; /* 8px */
  font-size: 0.875rem; /* 14px */
  color: #374151;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s, color 0.15s;
}
.context-menu-item:hover {
  background-color: #f3f4f6;
}
.context-menu-item.danger:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}
.context-menu-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.5rem 0;
}
.menu-title {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>