import { getNovelProject, updateNovelProjectContent } from '../api/projectApi';
import { useMetadataStore } from '@/novel/editor/stores/editor-state/metadataStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import { useReferenceStore } from '@/novel/editor/stores/referenceStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { useNovelSettingsStore } from '@/novel/editor/stores/novelSettingsStore';
import { useAIConfigStore } from '@/novel/editor/stores/ai/aiConfigStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { usePaneStore } from '@/novel/editor/stores/editor-state/paneStore';
import { useTabStore } from '@/novel/editor/stores/editor-state/tabStore';
import type { NovelProject } from '../types/project';

class NovelLoaderService {
    private resetAllStores() {
        useMetadataStore().$reset();
        useDirectoryStore().$reset();
        useRelatedContentStore().$reset();
        useNotesStore().$reset();
        useReferenceStore().$reset();
        useDerivedContentStore().$reset();
        useNovelSettingsStore().$reset();
        useAIConfigStore().$reset();
        usePaneStore().$reset();
        useTabStore().$reset(); // Assuming tabs are managed inside panes or have their own reset
    }

    public async loadProjectIntoEditor(novelId: string): Promise<boolean> {
        // Temporary holders for fetched data
        let projectData: NovelProject | undefined;
        let referenceTree: any[] | undefined; // Adjust type as needed

        try {
            console.log(`[Service] Fetching data for novel: ${novelId}`);

            // 1. Fetch all data into temporary variables
            projectData = await getNovelProject(novelId);
            if (!projectData) {
                throw new Error(`Novel project with ID "${novelId}" not found.`);
            }

            // Assuming referenceStore.loadReferences internally fetches data
            // To make this transactional, the fetch needs to be extracted.
            // For now, we'll proceed assuming it can fail.
            const referenceStore = useReferenceStore();
            await referenceStore.loadReferences(projectData.metadata.referenceNovelIds);

            // 2. If all fetches are successful, commit to stores
            const metadataStore = useMetadataStore();
            const directoryStore = useDirectoryStore();
            const relatedContentStore = useRelatedContentStore();
            const notesStore = useNotesStore();
            const derivedContentStore = useDerivedContentStore();
            const novelSettingsStore = useNovelSettingsStore();
            const aiConfigStore = useAIConfigStore();
            const uiStore = useUIStore();
            const paneStore = usePaneStore();
            const tabStore = useTabStore();

            metadataStore._setCurrentNovelId(novelId);
            metadataStore._setNovelMetadata(projectData.metadata);

            await aiConfigStore.initializeProviders();
            directoryStore.fetchDirectoryData(projectData.directoryData);
            relatedContentStore.fetchRelatedData(
                projectData.settingsData,
                projectData.plotCustomData,
                projectData.analysisCustomData,
                projectData.othersCustomData
            );
            derivedContentStore.fetchDerivedData(
                projectData.derivedPlotData || [],
                projectData.derivedAnalysisData || []
            );
            notesStore.fetchNotes(projectData.noteData);

            await novelSettingsStore.loadSettingsData();

            paneStore.initializePanes();
            uiStore.uiState.expandedNodeIds.clear();
            uiStore.uiState.expandedRelatedNodeIds.clear();
            uiStore.uiState.expandedReferenceNodeIds.clear();

            if (projectData.directoryData.length > 0) {
                uiStore.ensureNodeIsExpanded(projectData.directoryData[0].id);
            }
            uiStore.ensureRelatedNodeIsExpanded('setting');
            uiStore.ensureRelatedNodeIsExpanded('characters');
            uiStore.ensureRelatedNodeIsExpanded('plot');
            uiStore.ensureRelatedNodeIsExpanded('analysis');
            uiStore.ensureRelatedNodeIsExpanded('others');
            if (projectData.metadata.referenceNovelIds.length > 0) {
                const firstRefBookId = `ref-book-${projectData.metadata.referenceNovelIds[0]}`;
                uiStore.ensureReferenceNodeIsExpanded(firstRefBookId);
            }

            const firstChapterId = projectData.directoryData[0]?.chapters[0]?.id;
            if (firstChapterId) {
                tabStore.openTab(firstChapterId);
            }

            return true;
        } catch (error) {
            console.error(`[Service] Failed to load project ${novelId}:`, error);
            // 3. On failure, reset all stores to ensure clean state
            this.resetAllStores();
            return false;
        }
    }

    public async saveCurrentProject(): Promise<boolean> {
        const metadataStore = useMetadataStore();
        const novelId = metadataStore.currentNovelId;

        if (!novelId) {
            console.error("[Service] Cannot save: No current novel loaded.");
            return false;
        }

        try {
            console.log(`[Service] Saving project content for: ${novelId}`);

            const directoryStore = useDirectoryStore();
            const relatedContentStore = useRelatedContentStore();
            const derivedContentStore = useDerivedContentStore();
            const notesStore = useNotesStore();

            const projectContentToSave: Omit<NovelProject, 'metadata'> = {
                directoryData: directoryStore.directoryData,
                settingsData: relatedContentStore.settingsData,
                plotCustomData: relatedContentStore.plotCustomData,
                analysisCustomData: relatedContentStore.analysisCustomData,
                othersCustomData: relatedContentStore.othersCustomData,
                derivedPlotData: derivedContentStore.plotItems,
                derivedAnalysisData: derivedContentStore.analysisItems,
                noteData: notesStore.notes,
            };
            await updateNovelProjectContent(novelId, projectContentToSave);

            await metadataStore.saveMetadata();

            console.log(`[Service] Project ${novelId} saved successfully.`);
            return true;
        } catch (error) {
            console.error(`[Service] Failed to save project ${novelId}:`, error);
            return false;
        }
    }
}

export const projectLoaderService = new NovelLoaderService();