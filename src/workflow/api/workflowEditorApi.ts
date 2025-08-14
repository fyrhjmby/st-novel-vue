import type { FlowExportObject } from '@vue-flow/core';

const LOCAL_STORAGE_KEY = 'workflow-editor-state';

export const workflowEditorApi = {
    saveWorkflow: (flowData: FlowExportObject): Promise<{ success: true }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flowData));
                console.log('API: Workflow saved to localStorage.');
                resolve({ success: true });
            }, 500); // Simulate network delay
        });
    },

    loadWorkflow: (): Promise<FlowExportObject | null> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const data = localStorage.getItem(LOCAL_STORAGE_KEY);
                console.log('API: Workflow loaded from localStorage.');
                resolve(data ? JSON.parse(data) : null);
            }, 300); // Simulate network delay
        });
    },
};