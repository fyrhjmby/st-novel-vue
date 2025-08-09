import type { SearchResult, EditorItem, TreeNode } from '@/novel/editor/types';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import { useReferenceStore } from '@/novel/editor/stores/referenceStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

class SearchService {
    private get directoryStore() { return useDirectoryStore(); }
    private get relatedContentStore() { return useRelatedContentStore(); }
    private get notesStore() { return useNotesStore(); }
    private get referenceStore() { return useReferenceStore(); }

    public search(query: string): SearchResult[] {
        if (!query || query.trim().length < 1) {
            return [];
        }

        const lowerCaseQuery = query.toLowerCase();
        const resultsMap = new Map<string, SearchResult>();
        const tempDiv = document.createElement('div');

        const processItem = (item: EditorItem) => {
            if (item.type === 'system' || !('content' in item) || !item.content) return;

            tempDiv.innerHTML = item.content;
            const textContent = tempDiv.textContent || '';
            const lowerCaseText = textContent.toLowerCase();

            // 1. 检查标题是否匹配
            const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);

            // 2. 检查内容是否匹配
            let contentMatches = false;
            const regex = new RegExp(`(.{0,30})(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.{0,30})`, 'gi');
            let match;
            const matchesForThisItem: { context: string }[] = [];

            while ((match = regex.exec(textContent)) !== null) {
                contentMatches = true;
                if (matchesForThisItem.length < 5) { // Limit matches per item
                    const context = `${match[1]}<mark>${match[2]}</mark>${match[3]}`;
                    matchesForThisItem.push({ context: `...${context}...` });
                } else {
                    break;
                }
            }

            // 如果标题或内容任一匹配，则加入结果列表
            if(titleMatch || contentMatches){
                if (!resultsMap.has(item.id)) {
                    resultsMap.set(item.id, {
                        id: item.id,
                        title: item.title,
                        icon: getIconByNodeType(item.type),
                        item: item,
                        matches: []
                    });
                }
                const result = resultsMap.get(item.id)!;

                // 如果是因为内容匹配，添加匹配片段
                if(contentMatches){
                    result.matches.push(...matchesForThisItem);
                }
                // 如果只是标题匹配，可以添加一个特殊的 "match" 来注明
                else if (titleMatch) {
                    result.matches.push({ context: `<span class="italic text-gray-500">标题匹配</span>` });
                }
            }
        };

        // 遍历所有数据源
        this.directoryStore.directoryData.forEach(vol => {
            processItem(vol);
            vol.chapters.forEach(processItem);
        });

        const flattenAndProcess = (nodes: TreeNode[]) => {
            nodes.forEach(node => {
                if ('content' in node && node.content) {
                    processItem(node as EditorItem);
                }
                if (node.children) flattenAndProcess(node.children);
            });
        };

        flattenAndProcess(this.relatedContentStore.relatedData);
        flattenAndProcess(this.referenceStore.referenceData);

        this.notesStore.notes.forEach(processItem);

        return Array.from(resultsMap.values());
    }
}

export const searchService = new SearchService();