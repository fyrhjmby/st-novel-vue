import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ContextItem, TreeNode } from '@/novel/editor/types';
import { useRelatedContentStore } from './relatedContentStore';

const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export const useContextSettingsStore = defineStore('contextSettings', () => {
    const needsPreview = ref(true);
    const selectedContextItems = ref<ContextItem[]>([]);
    const customContextContent = ref('');
    const dynamicContextSettings = ref({
        prevChapters: 1,
        nextChapters: 0,
        includeRelatedPlot: true,
        includeRelatedAnalysis: true,
    });
    const isRagEnabled = ref(false);

    const fixedContextPresets = computed((): ContextItem[] => {
        const relatedStore = useRelatedContentStore();
        const presets: ContextItem[] = [];

        const processNode = (node: TreeNode, group: string) => {
            if (node.type.endsWith('_item') && 'content' in node && node.content) {
                presets.push({
                    id: node.id,
                    group,
                    title: node.title,
                    description: stripHtml(node.content).substring(0, 100) + '...',
                    content: node.content,
                });
            }
            if (node.children) {
                node.children.forEach(child => processNode(child, node.id === 'settings' ? child.title : group));
            }
        };

        if (relatedStore.settingsData.length > 0) {
            relatedStore.settingsData.forEach(rootNode => processNode(rootNode, '设定'));
        }
        return presets;
    });

    const addFixedContextItem = (item: ContextItem) => {
        if (!selectedContextItems.value.some(i => i.id === item.id)) {
            selectedContextItems.value.push(item);
        }
    };

    const removeFixedContextItem = (id: string) => {
        selectedContextItems.value = selectedContextItems.value.filter(i => i.id !== id);
    };

    const setCustomContextContent = (content: string) => {
        customContextContent.value = content;
    };

    const setDynamicContextSetting = (key: keyof typeof dynamicContextSettings.value, value: number | boolean) => {
        if (key in dynamicContextSettings.value) {
            (dynamicContextSettings.value[key] as any) = value;
        }
    };

    return {
        needsPreview,
        fixedContextPresets,
        selectedContextItems,
        customContextContent,
        dynamicContextSettings,
        isRagEnabled,
        addFixedContextItem,
        removeFixedContextItem,
        setCustomContextContent,
        setDynamicContextSetting,
    };
});