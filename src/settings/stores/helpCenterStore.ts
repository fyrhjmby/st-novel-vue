// src/settings/stores/helpCenterStore.ts

import { defineStore } from 'pinia';
import * as service from '@/settings/services/helpCenterService';
import type { HelpCategory } from '@/settings/api/helpCenterApi';

interface HelpCenterState {
    helpCategories: HelpCategory[];
    popularQuestions: string[];
    isLoading: boolean;
}

export const useHelpCenterStore = defineStore('help-center', {
    state: (): HelpCenterState => ({
        helpCategories: [],
        popularQuestions: [],
        isLoading: false,
    }),

    actions: {
        async initializeData() {
            if (this.helpCategories.length > 0) return;
            this.isLoading = true;
            try {
                const data = await service.loadHelpCenterData();
                this.helpCategories = data.categories;
                this.popularQuestions = data.questions;
            } catch (error) {
                console.error('Failed to initialize help center data:', error);
            } finally {
                this.isLoading = false;
            }
        },
    },
});