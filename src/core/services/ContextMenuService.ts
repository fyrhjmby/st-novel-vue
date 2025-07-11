// 文件: src/core/services/ContextMenuService.ts

import type { ContextMenuItem, CommandContext } from '@/core/types';
import type { ComponentPublicInstance } from 'vue';

type ContextMenuComponent = ComponentPublicInstance<{
    show: (event: MouseEvent, items: ContextMenuItem[]) => void;
}>;

type ContextMenuProvider = (context: CommandContext) => ContextMenuItem[];

class ContextMenuService {
    private providers: Map<string, ContextMenuProvider[]> = new Map();
    private menuComponent: ContextMenuComponent | null = null;

    public registerComponent(component: ContextMenuComponent): void {
        this.menuComponent = component;
    }

    public registerProvider(contextType: string, provider: ContextMenuProvider): void {
        if (!this.providers.has(contextType)) {
            this.providers.set(contextType, []);
        }
        this.providers.get(contextType)!.push(provider);
    }

    private getItems(contextType: string, context: CommandContext): ContextMenuItem[] {
        const providers = this.providers.get(contextType) || [];
        const allItems = providers.flatMap(provider => provider(context));

        // 可以在此处理分隔符，例如如果两个提供者之间需要分隔符
        return allItems;
    }

    public show(event: MouseEvent, contextType: string, context: CommandContext): void {
        event.preventDefault();
        event.stopPropagation();

        if (!this.menuComponent) {
            console.error("[ContextMenuService] Menu component is not registered.");
            return;
        }

        const items = this.getItems(contextType, context);
        if (items.length > 0) {
            this.menuComponent.show(event, items);
        }
    }
}

export const contextMenuService = new ContextMenuService();