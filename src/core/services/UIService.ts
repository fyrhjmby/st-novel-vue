// 文件: src/core/services/UIService.ts
// 描述: 提供与用户界面交互的抽象服务，将核心逻辑与具体UI实现解耦。

interface ConfirmationOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

class UIService {
    private confirmHandler: (options: ConfirmationOptions) => Promise<boolean> = async (options) => {
        const fullMessage = `${options.title}\n\n${options.message}`;
        return window.confirm(fullMessage);
    };

    /**
     * 请求用户确认。这会显示一个对话框并等待用户响应。
     * @param options - 配置对话框的内容。
     * @returns 一个解析为布尔值的 Promise，true 表示用户确认，false 表示取消。
     */
    public requestConfirmation(options: ConfirmationOptions): Promise<boolean> {
        return this.confirmHandler(options);
    }

    /**
     * 允许UI层（如Vue组件）注册一个自定义的确认对话框处理器。
     * @param handler - 一个接收选项并返回Promise<boolean>的函数。
     */
    public registerConfirmHandler(handler: (options: ConfirmationOptions) => Promise<boolean>): void {
        this.confirmHandler = handler;
    }
}

export const uiService = new UIService();