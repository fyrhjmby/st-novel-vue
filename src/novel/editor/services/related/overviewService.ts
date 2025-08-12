
import type { TreeNode, GroupNode, ItemNode, OverviewNode } from '@novel/editor/types';

/**
 * 辅助函数，用于降低内容中标题的级别 (e.g., h1 -> h2)
 * @param htmlContent - HTML 字符串
 * @returns 降级后的 HTML 字符串
 */
const demoteHeadings = (htmlContent: string): string => {
    if (typeof document === 'undefined') return htmlContent; // Guard for SSR
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

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


/**
 * 更新单个分组节点下的总览内容。
 * @param groupNode - 包含总览节点的父分组节点。
 */
function updateOverviewContentForGroup(groupNode: GroupNode) {
    if (!groupNode.children) return;

    const overviewNode = groupNode.children.find(child => child.isOverview) as OverviewNode | undefined;
    if (!overviewNode) return;

    const itemsToSummarize = groupNode.children.filter(child => child.type.endsWith('_item') && !child.isOverview) as ItemNode[];

    const itemContents = itemsToSummarize.map(item => item.content ? demoteHeadings(item.content) : '').filter(Boolean);

    overviewNode.content = `<h1>${overviewNode.title}</h1>` + (itemContents.length > 0 ? itemContents.join('<hr>') : `<p class="overview-placeholder">此分类下暂无内容，请添加条目。</p>`);
}

/**
 * 遍历整个设定树，更新所有找到的总览节点。
 * @param settingsData - 设定的树形数据 (可直接修改)
 */
export function updateAllOverviewContent(settingsData: TreeNode[]) {
    const findAndProcess = (nodes: TreeNode[]) => {
        for (const node of nodes) {
            if (node.type === 'group' && node.children?.some(c => c.isOverview)) {
                updateOverviewContentForGroup(node as GroupNode);
            }
            if (node.children) {
                findAndProcess(node.children);
            }
        }
    };
    findAndProcess(settingsData);
}