<template>
  <div class="editor-instance-container" :class="{'is-active-pane': isActive}" @click="setActivePane">
    <!-- Level 1: Tabs + Pane Actions -->
    <div class="top-header-bar">
      <div class="tabs-bar">
        <div
            v-for="tab in openTabs"
            :key="tab.id"
            class="tab-item"
            :class="{ 'active': tab.id === pane.activeTabId }"
            @click.stop="editorStore.openTab(tab.id, pane.id)"
        >
          <i :class="[tab.icon, 'tab-icon']"></i>
          <span class="tab-title">{{ tab.title }}</span>
          <i
              class="fa-solid fa-times close-icon"
              @click.stop="editorStore.closeTab(tab.id, pane.id)"
          ></i>
        </div>
      </div>
      <PaneActions :pane-id="pane.id" :is-active="isActive" />
    </div>

    <!-- Level 2: Breadcrumbs (only for document types) -->
    <BreadcrumbsBar v-if="activeTab && activeTab.item.type !== 'system'" :pane-id="pane.id" :is-active="isActive" />

    <!-- Main Content Area -->
    <PaneContentDispatcher
        ref="dispatcherRef"
        v-model="activeTabContent"
        :active-tab="activeTab"
        :is-active-pane="isActive"
        @show-context-menu="showEditorContextMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { useEditorStore, type EditorPane } from '@/novel/editor/stores/editorStore';
import PaneActions from '../layout/PaneActions.vue';
import BreadcrumbsBar from '../layout/BreadcrumbsBar.vue';
import PaneContentDispatcher from './PaneContentDispatcher.vue';

const props = defineProps({
  pane: {
    type: Object as PropType<EditorPane>,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  }
});

const editorStore = useEditorStore();
const dispatcherRef = ref<InstanceType<typeof PaneContentDispatcher> | null>(null);

const openTabs = computed(() => editorStore.getTabsForPane(props.pane.id));
const activeTab = computed(() => editorStore.getActiveTabForPane(props.pane.id));

const activeTabContent = computed({
  get: () => {
    if (activeTab.value?.item.type === 'system') return '';
    return (activeTab.value?.item?.content as string) || '';
  },
  set: (newContent: string) => {
    if (activeTab.value && activeTab.value.item.type !== 'system' && props.isActive) {
      editorStore.updateItemContentById(activeTab.value.id, newContent);
    }
  }
});

const setActivePane = () => {
  editorStore.setActivePane(props.pane.id)
};

const showEditorContextMenu = (event: MouseEvent) => {
  dispatcherRef.value?.showContextMenu(event, dispatcherRef.value.$el);
};
</script>

<style scoped>
.editor-instance-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FFFFFF;
  min-width: 0;
  transition: box-shadow 0.2s;
  border-left: 1px solid #E5E7EB;
}
.editor-instance-container:first-child {
  border-left: none;
}
.top-header-bar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background-color: #F3F4F6;
  border-bottom: 1px solid #E5E7EB;
}
.tabs-bar {
  display: flex;
  flex-grow: 1;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  overflow-x: auto;
  min-width: 0;
}
.tabs-bar::-webkit-scrollbar {
  display: none;
}
.tabs-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.tab-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  font-size: 0.875rem;
  color: #6B7280;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  border-bottom: none;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #E5E7EB;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}
.tab-item:not(:first-child) {
  margin-left: -1px;
}
.is-active-pane .tab-item:hover {
  background-color: #FFFFFF;
}
.tab-item.active {
  background-color: #FFFFFF;
  color: #1F2937;
  border-color: #E5E7EB;
  z-index: 2;
  margin-bottom: -1px;
  padding-bottom: calc(0.6rem + 1px);
}
.editor-instance-container:not(.is-active-pane) .tab-item {
  background-color: #F3F4F6;
  color: #9CA3AF;
}
.editor-instance-container:not(.is-active-pane) .tab-item.active {
  background-color: #FFFFFF;
  color: #6B7280;
  border-color: #E5E7EB;
}
.tab-icon {
  margin-right: 0.5rem;
}
.tab-item.active .tab-icon {
  color: #3B82F6;
}
.editor-instance-container:not(.is-active-pane) .tab-item.active .tab-icon {
  color: inherit;
}
.tab-title {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.close-icon {
  margin-left: 0.75rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.5;
  transition: all 0.2s;
}
.tab-item:hover .close-icon {
  opacity: 1;
}
.close-icon:hover {
  background-color: #E5E7EB;
}
</style>