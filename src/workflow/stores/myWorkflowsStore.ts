import { defineStore } from 'pinia';
import { ref } from 'vue';
import { myWorkflowsService } from '@/workflow/services/myWorkflowsService';
import type { Workflow } from '@/workflow/types';

export const useMyWorkflowsStore = defineStore('myWorkflows', () => {
    const workflows = ref<Workflow[]>([]);
    const isLoading = ref(false);

    const loadWorkflows = async () => {
        isLoading.value = true;
        try {
            workflows.value = await myWorkflowsService.getWorkflows();
        } catch (error) {
            console.error("Error loading workflows in store:", error);
            workflows.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        workflows,
        isLoading,
        loadWorkflows,
    };
});