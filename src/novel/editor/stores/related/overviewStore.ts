// src/novel/editor/stores/modules/related/overviewStore.ts
import { defineStore } from 'pinia';
import { watch } from 'vue';
import { useItemDataStore } from './itemDataStore.ts';
import type { TreeNode, GroupNode, ItemNode, OverviewNode } from '@novel/editor/types';

/**
 * 这个 store 专门用于管理和更新“总览”节点的内容。
 * 它通过 watch 监听 settingsData 的变化，自动重新生成总览。
 */
export const useOverviewStore = defineStore('related-overview', () => {
    const itemDataStore = useItemDataStore();

    /**
     * 更新单个分组节点下的总览内容。
     * @param groupNode - 包含总览节点的父分组节点。
     */
    function updateOverviewContent(groupNode: GroupNode) {
        if (!groupNode.children) return;

        const overviewNode = groupNode.children.find(child => child.isOverview) as OverviewNode | undefined;
        if (!overviewNode) return;

        // 筛选出需要被汇总的普通条目
        const itemsToSummarize = groupNode.children.filter(child => child.type.endsWith('_item') && !child.isOverview) as ItemNode[];

        // 辅助函数，用于降低内容中标题的级别 (e.g., h1 -> h2)
        const demoteHeadings = (htmlContent: string): string => {
            if (typeof document === 'undefined') return htmlContent; // Guard for SSR
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // 将 h1, h2, h3 等标题降级
            const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5');
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1), 10);
                const newLevel = Math.min(6, level + 1); // 最多降到 h6
                const newHeading = document.createElement(`h${newLevel}`);
                newHeading.innerHTML = heading.innerHTML;
                for (const attr of heading.attributes) {
                    newHeading.setAttribute(attr.name, attr.value);
                }
                heading.parentNode?.replaceChild(newHeading, heading);
            });
            return tempDiv.innerHTML;
        };

        // 拼接所有条目的内容
        const itemContents = itemsToSummarize.map(item => item.content ? demoteHeadings(item.content) : '').filter(Boolean);

        // 更新总览节点的内容
        overviewNode.content = `<h1>${overviewNode.title}</h1>` + (itemContents.length > 0 ? itemContents.join('<hr>') : `<p class="overview-placeholder">此分类下暂无内容，请添加条目。</p>`);
    }

    /**
     * 遍历整个设定树，更新所有找到的总览节点。
     */
    function updateAllOverviewContent() {
        const findAndProcess = (nodes: TreeNode[]) => {
            for (const node of nodes) {
                if (node.type === 'group' && node.children?.some(c => c.isOverview)) {
                    updateOverviewContent(node as GroupNode);
                }
                if (node.children) {
                    findAndProcess(node.children);
                }
            }
        };
        findAndProcess(itemDataStore.settingsData);
    }

    // 监听原始数据变化，自动更新总览
    watch(
        () => itemDataStore.settingsData,
        () => {
            updateAllOverviewContent();
        },
        { deep: true, immediate: true } // immediate确保初始化时也能执行
    );

    // 这个 store 主要通过 watch effect 工作，所以返回空对象
    return {};
});