import * as promptApi from '@/prompt/api/promptApi';
import type { Prompt } from '@/prompt/types/prompt';

export const fetchAllPrompts = (): Promise<Prompt[]> => {
    return promptApi.getPrompts();
};

export const fetchPromptById = (id: string): Promise<Prompt | undefined> => {
    return promptApi.getPrompt(id);
};

export const saveNewPrompt = (promptData: Omit<Prompt, 'id'>): Promise<Prompt> => {
    return promptApi.createPrompt(promptData);
};

export const updateExistingPrompt = (id: string, updates: Partial<Prompt>): Promise<Prompt | undefined> => {
    return promptApi.updatePrompt(id, updates);
};

export const removePrompt = (id: string): Promise<boolean> => {
    return promptApi.deletePrompt(id);
};