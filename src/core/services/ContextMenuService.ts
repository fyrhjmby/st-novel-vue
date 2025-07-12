// 文件: src/core/services/ContextMenuService.ts

import type { ContextMenuItem, CommandContext } from '@/core/types';
import { useContextMenuStore } from '@/core/stores/contextMenuStore';

type ContextMenuProvider = (context: CommandContext) => ContextMenuItem[];

class ContextMenuService {
    private providers: Map<string, ContextMenuProvider[]> = new Map();

    public registerProvider(contextType: string, provider: ContextMenuProvider): void {
        if (!this.providers.has(contextType)) {
            this.providers.set(contextType, []);
        }
        this.providers.get(contextType)!.push(provider);
    }

    private getItemsForContext(contextType: string, context: CommandContext): ContextMenuItem[] {
        const providers = this.providers.get(contextType) || [];
        let allItems: ContextMenuItem[] = [];

        providers.forEach((provider, index) => {
            const items = provider(context);
            if (items.length > 0) {
                if (index > 0 && allItems.length > 0 && !allItems[allItems.length - 1].isDivider) {
                    allItems.push({ commandId: `divider-${index}`, isDivider: true });
                }
                allItems = allItems.concat(items);
            }
        });

        return allItems;
    }

    public show(event: MouseEvent, contextType: string, context: CommandContext): void {
        event.preventDefault();
        event.stopPropagation();

        const contextMenuStore = useContextMenuStore();
        const items = this.getItemsForContext(contextType, context);

        if (items.length > 0) {
            contextMenuStore.showMenu(event, items);
        } else {
            contextMenuStore.hideMenu();
        }
    }
}

export const contextMenuService = new ContextMenuService();