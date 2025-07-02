<template>
  <div class="diff-preview-container">
    <div class="header">
      <h3 class="title">AI生成预览</h3>
      <div class="actions">
        <!-- [修复] 只有在有选中任务且任务已完成时才显示应用按钮 -->
        <button v-if="previewTask && previewTask.status === 'completed'" @click="$emit('apply-changes', previewTask.generatedContent)" class="apply-btn">
          <i class="fa-solid fa-check"></i>
          应用修改
        </button>
      </div>
    </div>
    <div class="content-area hide-scrollbar">
      <div v-if="previewTask">
        <!-- [新增] 流式预览: 当任务在进行中时显示 -->
        <div v-if="previewTask.status === 'processing'" class="prose-live">
          <div v-html="previewTask.generatedContent.replace(/\n/g, '<br>')"></div>
          <span class="blinking-cursor">▍</span>
        </div>

        <!-- [修复] 差异对比预览: 当任务已完成时显示 -->
        <div v-else-if="previewTask.status === 'completed'" v-html="diffHtml" class="prose-diff"></div>

        <!-- 其他状态的提示 -->
        <div v-else class="empty-state">
          <p>任务状态: {{ previewTask.status }}</p>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="fa-regular fa-eye text-3xl text-gray-300"></i>
        <p class="mt-2">请从上方任务队列中</p>
        <p>选择一个任务来查看预览。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
// [修复] 导入 diff_match_patch 和常量
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';
import type { AITask } from '@/novel/editor/stores/aiTaskStore';

// --- Props & Emits ---
const props = defineProps({
  previewTask: {
    type: Object as PropType<AITask | null>,
    default: null
  }
});

defineEmits<{
  (e: 'apply-changes', content: string): void;
}>();


/**
 * 差异对比的核心逻辑。
 * 使用 google-diff-match-patch 库来计算差异并生成HTML。
 */
const diffHtml = computed(() => {
  if (!props.previewTask || props.previewTask.status !== 'completed') return '';

  const dmp = new diff_match_patch();
  const text1 = props.previewTask.originalContent;
  const text2 = props.previewTask.generatedContent;

  const diffs = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);

  let html = '';
  // Sanitize text for HTML display
  const sanitize = (text: string) => text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br>');

  for (const [op, data] of diffs) {
    const text = sanitize(data);
    switch (op) {
      case DIFF_INSERT:
        // 用 <span> 替代 <ins> 以避免 ProseMirror 的默认样式冲突
        html += `<span class="diff-add">${text}</span>`;
        break;
      case DIFF_DELETE:
        // 用 <span> 替代 <del>
        html += `<span class="diff-del">${text}</span>`;
        break;
      case DIFF_EQUAL:
        html += `<span>${text}</span>`;
        break;
    }
  }
  return html;
});
</script>

<style scoped>
.diff-preview-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; height: 32px; /* 保持头部高度一致 */ }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.apply-btn { display: flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background-color: #16A34A; color: white; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 500; transition: background-color 0.2s ease; }
.apply-btn:hover { background-color: #15803D; }
.content-area { flex-grow: 1; background-color: #FFFFFF; border-radius: 0.5rem; border: 1px solid #E5E7EB; padding: 1rem; overflow-y: auto; font-size: 0.875rem; line-height: 1.7; color: #374151; }
.empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #9CA3AF; font-size: 0.875rem; }

.hide-scrollbar::-webkit-scrollbar { display: none; }

/* 流式预览的样式 */
.prose-live {
  white-space: pre-wrap;
}

.blinking-cursor {
  font-weight: 500;
  font-size: 1em;
  color: #3B82F6;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #3B82F6;
  }
}

/*
 * [修复] 使用 :global 来定义 diff 样式, 确保它们能作用于 v-html 插入的内容。
 * 并且使用 span 替代 del/ins 来避免浏览器默认样式或 ProseMirror 的干扰。
*/
:global(.prose-diff .diff-del) {
  background-color: #FEE2E2;
  text-decoration: line-through;
  text-decoration-color: #EF4444;
  color: #991B1B; /* 更深的红色以提高可读性 */
  padding: 1px 2px;
  border-radius: 3px;
}
:global(.prose-diff .diff-add) {
  background-color: #D1FAE5;
  text-decoration: none;
  color: #065F46;
  padding: 1px 2px;
  border-radius: 3px;
}
</style>