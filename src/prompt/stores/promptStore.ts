import { defineStore } from 'pinia';
import * as promptService from '@/prompt/services/promptService';
import type { Prompt } from '@/prompt/types/prompt';

interface PromptState {
    prompts: Prompt[];
    currentPrompt: Prompt | null;
    isLoading: boolean;
    error: string | null;
}

export const usePromptStore = defineStore('prompt', {
    state: (): PromptState => ({
        prompts: [],
        currentPrompt: null,
        isLoading: false,
        error: null,
    }),

    getters: {
        marketPrompts: (state) => state.prompts.filter(p => p.status === '公开'),
        myFavoritePrompts: (state) => state.prompts.filter(p => p.isFavorite),
        myPrompts: (state) => state.prompts.filter(p => p.author === '李欣然'), // 假设当前用户是李欣然
    },

    actions: {
        async fetchAllPrompts() {
            if (this.prompts.length > 0) return; // 如果已有数据，则不重复获取
            this.isLoading = true;
            this.error = null;
            try {
                this.prompts = await promptService.fetchAllPrompts();
            } catch (e: any) {
                this.error = '加载提示词失败。';
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPromptById(id: string) {
            this.isLoading = true;
            this.error = null;
            this.currentPrompt = null;
            try {
                const prompt = await promptService.fetchPromptById(id);
                if (prompt) {
                    this.currentPrompt = prompt;
                } else {
                    this.error = `未找到ID为 ${id} 的提示词。`;
                }
            } catch (e: any) {
                this.error = '加载提示词详情失败。';
            } finally {
                this.isLoading = false;
            }
        },

        async addPrompt(promptData: Omit<Prompt, 'id'>) {
            this.isLoading = true;
            this.error = null;
            try {
                const newPrompt = await promptService.saveNewPrompt(promptData);
                this.prompts.push(newPrompt);
            } catch (e: any) {
                this.error = '创建提示词失败。';
                throw e; // 抛出错误，以便组件可以捕获
            } finally {
                this.isLoading = false;
            }
        },

        async updatePrompt(id: string, updates: Partial<Prompt>) {
            this.isLoading = true;
            this.error = null;
            try {
                const updatedPrompt = await promptService.updateExistingPrompt(id, updates);
                if (updatedPrompt) {
                    const index = this.prompts.findIndex(p => p.id === id);
                    if (index !== -1) {
                        this.prompts[index] = updatedPrompt;
                    }
                    if (this.currentPrompt?.id === id) {
                        this.currentPrompt = updatedPrompt;
                    }
                }
            } catch (e: any) {
                this.error = '更新提示词失败。';
                throw e;
            } finally {
                this.isLoading = false;
            }
        },

        async deletePrompt(id: string) {
            this.isLoading = true;
            this.error = null;
            try {
                await promptService.removePrompt(id);
                this.prompts = this.prompts.filter(p => p.id !== id);
            } catch (e: any) {
                this.error = '删除提示词失败。';
            } finally {
                this.isLoading = false;
            }
        }
    },
});