// 文件: src/core/services/ConfigService.ts
// 描述: 全局配置服务，允许应用层覆盖内核的默认行为。

class ConfigService {
    private config: Map<string, any> = new Map();

    /**
     * 设置一个配置项。
     * 应用层在初始化时调用此方法来注入自定义配置。
     * @param key - 配置项的键 (e.g., 'pane.minWidth')。
     * @param value - 配置项的值。
     */
    public set(key: string, value: any): void {
        this.config.set(key, value);
    }

    /**
     * 获取一个配置项。
     * 如果配置未被设置，则返回提供的默认值。
     * @param key - 配置项的键。
     * @param defaultValue - 当找不到键时返回的默认值。
     * @returns 配置项的值或默认值。
     */
    public get<T>(key: string, defaultValue: T): T {
        if (this.config.has(key)) {
            return this.config.get(key) as T;
        }
        return defaultValue;
    }
}

// 导出一个单例，确保整个应用共享同一个配置服务。
export const configService = new ConfigService();