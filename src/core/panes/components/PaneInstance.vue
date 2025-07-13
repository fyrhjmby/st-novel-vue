<template>
  <div class="pane-instance-container" @click="paneManagementService.setActivePane(pane.id)">
    <TabBar :tabs="tabsForPane" :active-tab-id="pane.activeTabId" :pane-id="pane.id" :is-active-pane="isActive" />
    <div class="content-area">
      <div v-if="isLoading" class="loading-screen">
        <p>Loading...</p>
      </div>
      <ErrorDisplay
          v-else-if="loadingError"
          :message="loadingError"
          @reload="reloadContent"
      />
      <template v-else-if="activeCoreItem && activeTab">
        <component
            :is="resolvedView"
            :key="activeTab.id"
            :tab="activeTab"
            :item="activeCoreItem"
        />
      </template>
      <WelcomeScreen v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, type PropType } from 'vue';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { usePaneContent } from '@core/panes/composables/usePaneContent.ts';
import { paneManagementService } from '@core/panes/service/PaneManagementService.ts';
import type { LeafPaneNode, Tab } from '@core/types.ts';
import TabBar from '../../tabs/components/TabBar.vue';
import WelcomeScreen from '../../common/components/WelcomeScreen.vue';
import ErrorDisplay from '../../common/components/ErrorDisplay.vue';

const props = defineProps({
  pane: {
    type: Object as PropType<LeafPaneNode>,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const tabStore = useTabStore();

const {
  activeTab,
  activeCoreItem,
  isLoading,
  loadingError,
  resolvedView,
  reloadContent,
} = usePaneContent(toRef(props, 'pane'));

const tabsForPane = computed((): Tab[] => {
  return tabStore.getTabsForPane(props.pane.id);
});
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
</style>