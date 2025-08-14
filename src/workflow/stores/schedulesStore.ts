import { defineStore } from 'pinia';
import { ref } from 'vue';
import { schedulesService } from '@/workflow/services/schedulesService';
import type { Schedule } from '@/workflow/types';

export const useSchedulesStore = defineStore('schedules', () => {
    const schedules = ref<Schedule[]>([]);
    const isLoading = ref(false);

    const loadSchedules = async () => {
        isLoading.value = true;
        try {
            schedules.value = await schedulesService.getSchedules();
        } catch (error) {
            console.error('Error loading schedules in store:', error);
            schedules.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        schedules,
        isLoading,
        loadSchedules,
    };
});