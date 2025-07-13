import { contextMenuService } from '@core/panes/service/ContextMenuService';
import type { ContextMenuItem } from '@core/types';
import type { TreeNode } from '../components/sidebar/TreeView.vue';

function getDirectoryContextMenu(node: TreeNode): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];
    const context = { nodeId: node.id, type: node.type, node: node.originalData };

    switch (node.type) {
        case 'volume':
            items.push({ commandId: 'novel.chapter.create', context: { volumeId: node.id } });
            items.push({ commandId: 'novel.volume.create' });
            items.push({ commandId: 'novel.node.rename', context });
            items.push({ isDivider: true, commandId: 'd1' });
            items.push({ commandId: 'novel.ai.analyze', context: { ...context, isBatch: true } });
            items.push({ commandId: 'novel.ai.continue', context: { ...context, isBatch: true } });
            items.push({ isDivider: true, commandId: 'd2' });
            items.push({ commandId: 'novel.node.delete', context });
            break;

        case 'chapter':
            items.push({ commandId: 'novel.node.rename', context });
            items.push({ isDivider: true, commandId: 'd1' });
            items.push({ commandId: 'novel.ai.analyze', context });
            items.push({ commandId: 'novel.ai.continue', context });
            items.push({ isDivider: true, commandId: 'd2' });
            items.push({ commandId: 'novel.node.delete', context });
            break;

        case 'note':
            items.push({ commandId: 'novel.node.rename', context });
            items.push({ isDivider: true, commandId: 'd1' });
            items.push({ commandId: 'novel.node.delete', context });
            break;

        case 'root':
            if (node.id === 'settings') {
                items.push({ commandId: 'novel.related.create-group', context });
                items.push({ commandId: 'novel.related.create-item', context });
            } else if (node.id === 'plot' || node.id === 'analysis') {
                items.push({ commandId: 'novel.related.create-custom', context });
            }
            break;

        default: // Handles settings items, related items, etc.
            if (node.type === 'group') {
                items.push({ commandId: 'novel.related.create-item', context });
            }
            if (node.id.startsWith('custom-') || node.type.endsWith('_item') || node.type === 'group') {
                items.push({ isDivider: true, commandId: 'd1' });
                items.push({ commandId: 'novel.node.rename', context });
                items.push({ isDivider: true, commandId: 'd2' });
                items.push({ commandId: 'novel.node.delete', context });
            }
            break;
    }

    return items;
}

export function registerNovelContextMenu() {
    contextMenuService.registerProvider('novel-directory-node', (context) => {
        const node = context.node as TreeNode | undefined;
        if (!node) return [];
        return getDirectoryContextMenu(node);
    });

    contextMenuService.registerProvider('novel-editor-content', () => {
        return [
            { commandId: 'novel.ai.continue' },
            { commandId: 'novel.ai.polish' },
            { isDivider: true, commandId: 'd1' },
            { commandId: 'novel.ai.analyze' }
        ];
    });
}