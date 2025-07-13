import { watch } from 'vue';
import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { contextService } from '@core/common/services/ContextService.ts';
import { CoreContext } from '@core/constants.ts';

export function initializePaneContexts() {
    const paneStore = usePaneStore();

    const updateContext = () => {
        const isSplit = (paneStore.root?.type ?? 'leaf') === 'split';
        contextService.set(CoreContext.PANE_IS_SPLIT, isSplit);
    };

    watch(() => paneStore.root, updateContext, { immediate: true, deep: true });
}