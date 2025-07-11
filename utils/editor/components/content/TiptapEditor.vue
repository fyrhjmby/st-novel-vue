<template>
  <div v-if="editor" class="editor-wrapper">
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

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'show-context-menu', event: MouseEvent): void;
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML() || '')
  },
  editorProps: {
    attributes: {
      class: 'prose-mirror-focus',
    },
  },
})

watch(() => props.modelValue, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue
  if (isSame) {
    return
  }
  editor.value?.commands.setContent(newValue, false)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
<style scoped>
:deep(.ProseMirror) {
  min-height: calc(100vh - 12rem);
  outline: none;
  padding: 1rem;
  font-family: 'Georgia', 'Noto Serif SC', serif;
  line-height: 1.75;
  color: #374151;
}

:deep(.prose-mirror-focus:focus-visible) {}

:deep(.prose h1) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
:deep(.prose p) {
  margin-top: 1em;
  margin-bottom: 1em;
}
:deep(.prose h2) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
:deep(.prose h3) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>