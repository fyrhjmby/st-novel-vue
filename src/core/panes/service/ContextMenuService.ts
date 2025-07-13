import type { ContextMenuItem, CommandContext, Command, ProcessedMenuItem } from '@core/types.ts';
import { useContextMenuStore } from '@core/panes/stores/contextMenuStore.ts';
import { commandService } from '../../services/CommandService.ts';

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
        const rawItems = this.getItemsForContext(contextType, context);

        if (rawItems.length === 0) {
            contextMenuStore.hideMenu();
            return;
        }

        const processedItems = this.processItems(rawItems);

        if (processedItems.length > 0) {
            contextMenuStore.showMenu(event, processedItems);
        } else {
            contextMenuStore.hideMenu();
        }
    }

    public execute(item: ProcessedMenuItem): void {
        if (!item.isDisabled) {
            commandService.execute(item.command.id, item.context);
            useContextMenuStore().hideMenu();
        }
    }

    private processItems(items: ContextMenuItem[]): ProcessedMenuItem[] {
        return items.map((item, index) => {
            if (item.isDivider) {
                return { id: `d-${index}`, isDivider: true, isDisabled: true, label: '', command: {} as Command, context: undefined };
            }
            const command = commandService.find(item.commandId);
            const isDisabled = !command || !commandService.canExecute(item.commandId, item.context);
            const label = command
                ? (typeof command.label === 'function' ? command.label({ ...item.context }) : command.label)
                : 'Unknown Command';

            return {
                id: `${item.commandId}-${index}`,
                isDivider: false,
                isDisabled,
                label,
                icon: command?.icon,
                command: command!,
                context: item.context,
            };
        });
    }
}

export const contextMenuService = new ContextMenuService();