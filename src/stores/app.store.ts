import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const pageTitle = ref('AI Creator Platform');

    function setPageTitle(title: string) {
        pageTitle.value = title || 'AI Creator Platform';
    }

    return { pageTitle, setPageTitle };
});