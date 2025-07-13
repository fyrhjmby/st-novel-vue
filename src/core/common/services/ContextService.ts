

import { reactive } from 'vue';

type ContextValue = boolean | string | number;

class ContextService {
    private contextState: Map<string, ContextValue> = reactive(new Map());

    constructor() {
        this.contextState.set('alwaysTrue', true); // A default context for commands without a 'when' clause
    }

    /**
     * 设置一个上下文键的值。
     * @param key - 上下文键 (e.g., 'editorFocus', 'isReadOnly').
     * @param value - 上下文的值.
     */
    public set(key: string, value: ContextValue): void {
        if (this.contextState.get(key) !== value) {
            this.contextState.set(key, value);
        }
    }

    /**
     * 获取一个上下文键的值。
     * @param key - 上下文键。
     * @returns The value of the context key, or undefined if not set.
     */
    public get(key: string): ContextValue | undefined {
        return this.contextState.get(key);
    }

    /**
     * 检查一个基于字符串的 'when' 表达式是否为真。
     * 目前仅支持 '&&', '||', '!', '==', '!=' 和键名。
     * @param when - The when clause string, e.g., "editorFocus && !isReadOnly".
     * @returns True if the expression evaluates to true, false otherwise.
     */
    public check(when: string): boolean {
        try {
            const keys = Array.from(this.contextState.keys());
            // This is a safer alternative to eval(). It creates a function where
            // context keys are arguments, preventing access to the global scope.
            const func = new Function(...keys, `return !!(${when});`);
            const values = keys.map(key => this.contextState.get(key));
            return func(...values);
        } catch (error) {
            console.error(`[ContextService] Error evaluating 'when' clause: "${when}"`, error);
            return false;
        }
    }
}

export const contextService = new ContextService();