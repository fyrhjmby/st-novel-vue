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

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'show-context-menu', event: MouseEvent): void;
}>()

const editor = useEditor({
  content: props.modelValue,
  editable: props.isEditable,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
  ],
  onUpdate: () => {
    if (editor.value?.isEditable) {
      emit('update:modelValue', editor.value?.getHTML() || '')
    }
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

watch(() => props.isEditable, (value) => {
  editor.value?.setEditable(value);
});

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

:deep(.ProseMirror[contenteditable="false"]) {
  cursor: default;
}

:deep(.prose-mirror-focus:focus-visible) {}

:deep(.prose h1) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  text-align: center;
  border-bottom: none;
}
:deep(.prose p) {
  margin-top: 1em;
  margin-bottom: 1em;
}
:deep(.prose h2) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  padding-bottom: 0;
  border-bottom: none;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
:deep(.prose h3) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
:deep(.prose hr) {
  border-top: 1px solid #e5e7eb;
  margin: 3rem 0;
}
:deep(.prose p.overview-placeholder) {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  margin-top: 2rem;
  border: 1px dashed #e5e7eb;
  padding: 2rem;
  border-radius: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  line-height: 1.6;
}
</style>