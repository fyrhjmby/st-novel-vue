// 文件: src/novel/editor/stores/contextSettingsStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ContextItem, TreeNode, DynamicContextSettings, ReferenceContextSettings } from '@/novel/editor/types';
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
    const selectedOthersItems = ref<ContextItem[]>([]);
    const customContextContent = ref('');
    const dynamicContextSettings = ref<DynamicContextSettings>({
        prevVolumes: 0,
        nextVolumes: 0,
        prevChapters: 1,
        nextChapters: 0,
        includeVolumePlot: false,
        includeVolumeAnalysis: false,
        includeRelatedPlot: true,
        includeRelatedAnalysis: true,
    });
    const referenceContextSettings = ref<ReferenceContextSettings>({
        includeContent: true,
        includeAnalysis: false,
        includePlot: false,
        includeVolumeInfo: false,
    });
    const isRagEnabled = ref(false);

    const fixedContextPresets = computed((): ContextItem[] => {
        const relatedStore = useRelatedContentStore();
        const presets: ContextItem[] = [];

        const processNode = (node: TreeNode, group: string) => {
            if (node.type.endsWith('_item') && 'content' in node && node.content) {
                presets.push({
                    id: node.id,
                    category: '设定',
                    group,
                    title: node.title,
                    description: stripHtml(node.content).substring(0, 100) + '...',
                    content: node.content,
                });
            }
            if (node.children) {
                node.children.forEach(child => processNode(child, node.id === 'setting' ? child.title : group));
            }
        };

        if (relatedStore.settingsData.length > 0) {
            relatedStore.settingsData.forEach(rootNode => processNode(rootNode, '设定'));
        }
        return presets;
    });

    const othersContextPresets = computed((): ContextItem[] => {
        const relatedStore = useRelatedContentStore();
        const presets: ContextItem[] = [];

        const processNode = (node: TreeNode) => {
            if (node.type === 'others_item' && 'content' in node && node.content) {
                presets.push({
                    id: node.id,
                    category: '其他',
                    group: '其他',
                    title: node.title,
                    description: stripHtml(node.content).substring(0, 100) + '...',
                    content: node.content,
                });
            }
            if (node.children) {
                node.children.forEach(child => processNode(child));
            }
        };

        const othersRoot = relatedStore.relatedData.find(n => n.id === 'others');
        if (othersRoot && othersRoot.children) {
            processNode(othersRoot);
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

    const addOthersContextItem = (item: ContextItem) => {
        if (!selectedOthersItems.value.some(i => i.id === item.id)) {
            selectedOthersItems.value.push(item);
        }
    };

    const removeOthersContextItem = (id: string) => {
        selectedOthersItems.value = selectedOthersItems.value.filter(i => i.id !== id);
    };

    const setCustomContextContent = (content: string) => {
        customContextContent.value = content;
    };

    const setDynamicContextSetting = (key: keyof DynamicContextSettings, value: number | boolean) => {
        if (key in dynamicContextSettings.value) {
            dynamicContextSettings.value[key] = value as never;
        }
    };

    const setReferenceContextSetting = (key: keyof ReferenceContextSettings, value: boolean) => {
        if (key in referenceContextSettings.value) {
            referenceContextSettings.value[key] = value as never;
        }
    };

    return {
        needsPreview,
        fixedContextPresets,
        othersContextPresets,
        selectedContextItems,
        selectedOthersItems,
        customContextContent,
        dynamicContextSettings,
        referenceContextSettings,
        isRagEnabled,
        addFixedContextItem,
        removeFixedContextItem,
        addOthersContextItem,
        removeOthersContextItem,
        setCustomContextContent,
        setDynamicContextSetting,
        setReferenceContextSetting,
    };
});