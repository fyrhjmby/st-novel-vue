// 文件: src/core/components/PaneInstance.vue

<template>
  <div class="pane-instance-container" @click="paneStore.setActivePane(pane.id)">
    <TabBar :tabs="tabsForPane" :active-tab-id="pane.activeTabId" :pane-id="pane.id" :is-active-pane="isActive" />
    <div class="content-area">
      <div v-if="isLoading" class="loading-screen">
        <p>Loading...</p>
      </div>
      <template v-else-if="activeCoreItem && activeTab">
        <component
            :is="resolvedView"
            :key="activeTab.id"
            :tab="activeTab"
            :item="activeCoreItem"
        />
      </template>
      <!-- 使用真正的 WelcomeScreen 组件 -->
      <WelcomeScreen v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { useTabStore } from '@/core/stores/tabStore';
import { viewRegistry } from '@/core/services/ViewRegistry';
import type { Pane, CoreItem, Tab } from '@/core/types';
import TabBar from './TabBar.vue';
import WelcomeScreen from './WelcomeScreen.vue'; // <-- 导入组件

const props = defineProps({
  pane: {
    type: Object as PropType<Pane>,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const paneStore = usePaneStore();
const tabStore = useTabStore();

const activeCoreItem = ref<CoreItem | null>(null);
const isLoading = ref(false);

const activeTab = computed((): Tab | undefined => {
  return props.pane.activeTabId ? tabStore.getTabById(props.pane.activeTabId) : undefined;
});

const tabsForPane = computed((): Tab[] => {
  return tabStore.getTabsForPane(props.pane.id);
});

const resolvedView = computed(() => {
  if (activeCoreItem.value?.viewType) {
    return viewRegistry.resolve(activeCoreItem.value.viewType);
  }
  return null;
});

watch(
    () => props.pane.activeTabId,
    async (newTabId) => {
      if (newTabId) {
        const loadingTabId = newTabId;
        isLoading.value = true;
        activeCoreItem.value = null;

        try {
          const item = await tabStore.loadCoreItemForTab(loadingTabId);
          if (props.pane.activeTabId === loadingTabId) {
            activeCoreItem.value = item;
          }
        } catch (error) {
          console.error(`Failed to load content for tab ${loadingTabId}`, error);
          if (props.pane.activeTabId === loadingTabId) {
            activeCoreItem.value = null;
          }
        } finally {
          if (props.pane.activeTabId === loadingTabId) {
            isLoading.value = false;
          }
        }
      } else {
        activeCoreItem.value = null;
        isLoading.value = false;
      }
    },
    { immediate: true }
);
</script>

<style scoped>
.pane-instance-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FFFFFF;
  border-left: 1px solid #E5E7EB;
}
.pane-instance-container:first-child {
  border-left: none;
}
.content-area {
  flex-grow: 1;
  overflow: auto;
  position: relative;
}
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9CA3AF;
  user-select: none;
}
/* WelcomeScreen has its own styles, so we remove the generic one */
</style>