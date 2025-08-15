import type { FlowExportObject } from '@vue-flow/core';

const LOCAL_STORAGE_KEY_PREFIX = 'workflow-editor-state-';

export const editorApi = {
    saveWorkflow: (id: string, flowData: FlowExportObject): Promise<{ success: true }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const key = `${LOCAL_STORAGE_KEY_PREFIX}${id}`;
                localStorage.setItem(key, JSON.stringify(flowData));
                console.log(`API: Workflow [${id}] saved to localStorage.`);
                resolve({ success: true });
            }, 500);
        });
    },

    loadWorkflow: (id: string): Promise<FlowExportObject | null> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const key = `${LOCAL_STORAGE_KEY_PREFIX}${id}`;
                const data = localStorage.getItem(key);
                console.log(`API: Workflow [${id}] loaded from localStorage.`);
                resolve(data ? JSON.parse(data) : null);
            }, 300);
        });
    },
};