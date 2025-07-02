// =
// 文件: ..\src\novel\editor\components\content\TiptapEditor.vue
//

<template>
  <div v-if="editor" class="editor-wrapper">
    <!-- [修复] 将 contextmenu 事件绑定到 editor-content 上 -->
    <editor-content
        :editor="editor"
        class="prose prose-lg max-w-none"
        @contextmenu.prevent="emit('show-context-menu', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch, onBeforeUnmount } from 'vue'

// --- Props & Emits ---

const props = defineProps<{
  // 使用 v-model 接收和更新内容
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  // [新增] 定义 show-context-menu 事件，用于通知父组件显示右键菜单
  (e: 'show-context-menu', event: MouseEvent): void;
}>()

// --- Tiptap Editor Instance ---

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // 配置以匹配 UI 设计
      heading: { levels: [1, 2, 3] },
    }),
  ],
  onUpdate: () => {
    // 同步内容到父组件
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
  editorProps: {
    attributes: {
      class: 'prose-mirror-focus',
    },
  },
})

// --- Logic ---

/**
 * 监听外部 modelValue 的变化 (例如，用户切换了章节)
 * 当外部数据变化时，需要同步更新编辑器内部的内容
 */
watch(() => props.modelValue, (newValue) => {
  // 检查新值与编辑器当前值是否不同，防止不必要更新和光标跳动
  const isSame = editor.value?.getHTML() === newValue
  if (isSame) {
    return
  }
  // 使用 setContent 更新编辑器内容
  // 第二个参数 false 表示不触发 onUpdate 回调，避免无限循环
  editor.value?.commands.setContent(newValue, false)
})

/**
 * 组件卸载前，销毁编辑器实例，防止内存泄漏
 */
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
/*
 * 使用 :deep() 来穿透 scoped CSS 的限制，
 * 为 Tiptap 动态生成的 .ProseMirror 元素添加样式
 */
:deep(.ProseMirror) {
  min-height: calc(100vh - 12rem); /* 确保编辑器区域足够高 */
  outline: none;
  /* 提供内边距，使文本不贴边 */
  padding: 1rem;
  /* 设置字体和行高，以获得更好的阅读体验 */
  font-family: 'Georgia', 'Noto Serif SC', serif;
  line-height: 1.75;
  color: #374151;
}

/* 自定义编辑器获得焦点时的样式 */
:deep(.prose-mirror-focus:focus-visible) {
  /* box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); */
}

/* 覆盖 prose 插件的样式以匹配UI */
:deep(.prose h1) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  margin-bottom: 1.5rem;
}
:deep(.prose p) {
  margin-top: 1em;
  margin-bottom: 1em;
}
:deep(.prose h2) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
:deep(.prose h3) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>