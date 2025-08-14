import { watchEffect } from 'vue';
import { useSystemSettingsStore } from '@/settings/stores/systemSettingsStore';

/**
 * Applies a global zoom effect to the entire application by transforming the root <html> element.
 */
export function useZoomEffect() {
    const settingsStore = useSystemSettingsStore();

    watchEffect(() => {
        const rootElement = document.documentElement;
        if (rootElement) {
            const scaleValue = settingsStore.zoomLevel / 100;
            rootElement.style.setProperty('transform-origin', 'center center');
            rootElement.style.setProperty('transition', 'transform 0.3s ease');
            rootElement.style.setProperty('transform', `scale(${scaleValue})`);
        }
    });
}