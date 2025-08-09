import type {
    Volume,
    NoteItem,
    NovelMetadata as BaseNovelMetadata,
    TreeNode,
    ItemNode,
    PlotAnalysisItem,
} from '@/novel/editor/types';

export interface NovelMetadata extends BaseNovelMetadata {
    referenceNovelIds: string[];
}

export interface NovelProject {
    metadata: NovelMetadata;
    directoryData: Volume[];
    settingsData: TreeNode[];
    plotCustomData: ItemNode[];
    analysisCustomData: ItemNode[];
    derivedPlotData: PlotAnalysisItem[];
    derivedAnalysisData: PlotAnalysisItem[];
    othersCustomData: ItemNode[];
    noteData: NoteItem[];
}