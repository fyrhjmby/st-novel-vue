import type { FlowExportObject } from '@vue-flow/core';
import { editorApi } from '@/workflow/editor/api/editorApi';

export const editorService = {
    save: (id: string, flowData: FlowExportObject): Promise<{ success: true }> => {
        return editorApi.saveWorkflow(id, flowData);
    },
    load: (id: string): Promise<FlowExportObject | null> => {
        return editorApi.loadWorkflow(id);
    },
};