// src/novel/dashboard/stores/recentStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { NovelDashboardItem, RecentActivityItem } from '@/novel/types';
import * as dashboardService from '@/novel/dashboard/services/dashboardService';
import { formatDistanceToNowStrict } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const RECENTS_QUEUE_LIMIT = 10;

const formatTimeAgo = (isoString: string): string => {
    const date = new Date(isoString);
    const diff = new Date().getTime() - date.getTime();
    if (diff < 60000) { // 1分钟内
        return '刚刚';
    }
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: zhCN });
};

export const useRecentStore = defineStore('novel-dashboard-recent', () => {
    const recentItems = ref<RecentActivityItem[]>([]);
    const isLoading = ref(false);

    const groupedRecentItems = computed(() => {
        const groups: { period: string; items: RecentActivityItem[] }[] = [];
        if (recentItems.value.length === 0) return groups;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const sortedItems = [...recentItems.value].sort((a, b) => new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime());

        sortedItems.forEach(item => {
            item.formattedTime = formatTimeAgo(item.editedAt);
        });

        const todayItems: RecentActivityItem[] = [];
        const yesterdayItems: RecentActivityItem[] = [];
        const earlierItems: RecentActivityItem[] = [];

        sortedItems.forEach(item => {
            const itemDate = new Date(item.editedAt);
            itemDate.setHours(0, 0, 0, 0);

            if (itemDate.getTime() === today.getTime()) {
                todayItems.push(item);
            } else if (itemDate.getTime() === yesterday.getTime()) {
                earlierItems.push(item);
            } else {
                earlierItems.push(item);
            }
        });

        if (todayItems.length > 0) groups.push({ period: '今天', items: todayItems });
        if (yesterdayItems.length > 0) groups.push({ period: '昨天', items: yesterdayItems });
        if (earlierItems.length > 0) groups.push({ period: '更早', items: earlierItems });

        return groups;
    });

    const fetchRecentItems = async () => {
        isLoading.value = true;
        try {
            recentItems.value = await dashboardService.fetchRecentItems();
        } catch (error) {
            console.error('Failed to fetch recent items:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const logRecentAccess = async (novel: NovelDashboardItem) => {
        try {
            // 先从列表中移除旧的记录（如果存在）
            const existingIndex = recentItems.value.findIndex(item => item.novelId === novel.id);
            if (existingIndex !== -1) {
                recentItems.value.splice(existingIndex, 1);
            }

            // 调用Service记录访问，并获取最新的活动项
            const newActivity = await dashboardService.logRecentAccess(novel.id);

            // 将新活动添加到列表顶部
            recentItems.value.unshift(newActivity);

            // 保持列表长度限制
            if (recentItems.value.length > RECENTS_QUEUE_LIMIT) {
                recentItems.value.pop();
            }
        } catch (error) {
            console.error('Failed to log recent access:', error);
        }
    };

    return {
        recentItems,
        isLoading,
        groupedRecentItems,
        fetchRecentItems,
        logRecentAccess,
    };
});