import type { TreeNode, ItemNode, PlotAnalysisItem, Volume, Chapter } from '@/novel/editor/types';
import type { NovelProject } from '@/novel/editor/types/project';
import { getNovelProject } from '@/novel/services/novelProjectService';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

class ReferenceService {

    private makeNodesReadOnly(nodes: TreeNode[]): TreeNode[] {
        return nodes.map(node => {
            const newNode: TreeNode = { ...node, isReadOnly: true };
            if (newNode.children) {
                newNode.children = this.makeNodesReadOnly(newNode.children);
            }
            if (newNode.isOverview) {
                newNode.content = `<p class="overview-placeholder">参考书中所有内容均为只读。</p>`;
            }
            return newNode;
        });
    }

    private projectToTreeNode(project: NovelProject): TreeNode {
        const rootNode: TreeNode = {
            id: `ref-book-${project.metadata.id}`,
            type: 'reference_book',
            title: project.metadata.title,
            icon: getIconByNodeType('reference_book'),
            children: []
        };

        const directoryNode: TreeNode = {
            id: `ref-dir-${project.metadata.id}`,
            type: 'reference_content_item',
            title: '目录',
            icon: 'fa-regular fa-folder-open',
            children: this.makeNodesReadOnly(project.directoryData.map((vol: Volume) => ({
                id: vol.id,
                title: vol.title,
                type: 'reference_volume',
                icon: getIconByNodeType('reference_volume'),
                content: vol.content,
                isReadOnly: true,
                children: vol.chapters.map((chap: Chapter) => ({
                    id: chap.id,
                    title: chap.title,
                    type: 'reference_chapter',
                    icon: getIconByNodeType('reference_chapter'),
                    content: chap.content,
                    isReadOnly: true
                }))
            })))
        };
        rootNode.children?.push(directoryNode);

        const buildRefDerivedContentTree = (type: 'plot' | 'analysis', dataArray: PlotAnalysisItem[] | undefined, directory: Volume[]): TreeNode[] => {
            if (!dataArray || dataArray.length === 0) return [];

            return directory.map((volume: Volume) => {
                const derivedForVolume = dataArray
                    .filter((item: PlotAnalysisItem) => item.sourceId === volume.id)
                    .map((item: PlotAnalysisItem) => ({
                        id: item.id,
                        title: item.title,
                        type: `${type}_item` as ItemNode['type'],
                        icon: getIconByNodeType(`${type}_item`),
                        content: item.content,
                        originalData: item
                    }));

                const derivedForChapters = volume.chapters
                    .map((chapter: Chapter) => {
                        const itemsForChapter = dataArray.filter((item: PlotAnalysisItem) => item.sourceId === chapter.id);
                        if (itemsForChapter.length === 0) return null;

                        return {
                            id: `ref-derived-group-${type}-${chapter.id}`,
                            title: chapter.title,
                            type: 'group',
                            icon: getIconByNodeType('chapter'),
                            children: itemsForChapter.map((item: PlotAnalysisItem) => ({
                                id: item.id,
                                title: item.title,
                                type: `${type}_item` as ItemNode['type'],
                                icon: getIconByNodeType(`${type}_item`),
                                content: item.content,
                                originalData: item
                            }))
                        };
                    })
                    .filter((c: TreeNode | null): c is TreeNode => c !== null);

                if (derivedForVolume.length === 0 && derivedForChapters.length === 0) {
                    return null;
                }

                return {
                    id: `ref-derived-group-${type}-${volume.id}`,
                    title: volume.title,
                    type: 'group',
                    icon: getIconByNodeType('volume'),
                    children: [
                        ...derivedForVolume,
                        ...derivedForChapters
                    ]
                };
            }).filter((v: TreeNode | null): v is TreeNode => v !== null);
        };

        const plotTree = buildRefDerivedContentTree('plot', project.derivedPlotData, project.directoryData);
        const plotNode: TreeNode = {
            id: `ref-plot-${project.metadata.id}`,
            type: 'reference_content_item',
            title: '剧情',
            icon: getIconByNodeType('plot'),
            children: this.makeNodesReadOnly([
                ...project.plotCustomData,
                ...plotTree
            ])
        };
        if (plotNode.children && plotNode.children.length > 0) {
            rootNode.children?.push(plotNode);
        }

        const analysisTree = buildRefDerivedContentTree('analysis', project.derivedAnalysisData, project.directoryData);
        const analysisNode: TreeNode = {
            id: `ref-analysis-${project.metadata.id}`,
            type: 'reference_content_item',
            title: '分析',
            icon: getIconByNodeType('analysis'),
            children: this.makeNodesReadOnly([
                ...project.analysisCustomData,
                ...analysisTree
            ])
        };
        if (analysisNode.children && analysisNode.children.length > 0) {
            rootNode.children?.push(analysisNode);
        }

        const settingsRoot = project.settingsData.find(n => n.id === 'setting');
        if (settingsRoot && settingsRoot.children) {
            const settingsNode: TreeNode = {
                id: `ref-settings-${project.metadata.id}`,
                type: 'reference_content_item',
                title: settingsRoot.title,
                icon: getIconByNodeType('setting'),
                children: this.makeNodesReadOnly(settingsRoot.children)
            };
            rootNode.children?.push(settingsNode);
        }

        return rootNode;
    }

    public buildReferenceTree(referenceNovelIds: string[]): TreeNode[] {
        if (!referenceNovelIds || referenceNovelIds.length === 0) {
            return [];
        }

        const newReferenceData = referenceNovelIds
            .map(novelId => {
                const project = getNovelProject(novelId);
                return project ? this.projectToTreeNode(project) : null;
            })
            .filter((node): node is TreeNode => node !== null);

        return newReferenceData;
    }
}

export const referenceService = new ReferenceService();