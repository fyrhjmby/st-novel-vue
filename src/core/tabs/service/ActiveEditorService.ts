// 文件: src/core/services/ActiveEditorService.ts

interface EditorAPI {
    getContent: () => string;
    setContent: (newContent: string) => void;
}

class ActiveEditorService {
    // The key is now the unique Tab ID, not the Item ID.
    private activeEditors: Map<string, EditorAPI> = new Map();

    public register(tabId: string, api: EditorAPI): void {
        this.activeEditors.set(tabId, api);
    }

    public unregister(tabId: string): void {
        this.activeEditors.delete(tabId);
    }

    public getContent(tabId: string): string | null {
        const editor = this.activeEditors.get(tabId);
        if (editor && typeof editor.getContent === 'function') {
            return editor.getContent();
        }
        return null;
    }

    public setContent(tabId: string, newContent: string): boolean {
        const editor = this.activeEditors.get(tabId);
        if (editor && typeof editor.setContent === 'function') {
            editor.setContent(newContent);
            return true;
        }
        return false;
    }
}

export const activeEditorService = new ActiveEditorService();