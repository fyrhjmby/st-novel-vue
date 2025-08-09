import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Novel } from '@/novel/types';
import type { RecentActivityItem } from '@/novel/dashboard/types';
import { mockRecentItems } from '@/novel/dashboard/data';
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

        if (todayItems.length > 0) {
            groups.push({ period: '今天', items: todayItems });
        }
        if (yesterdayItems.length > 0) {
            groups.push({ period: '昨天', items: yesterdayItems });
        }
        if (earlierItems.length > 0) {
            groups.push({ period: '更早', items: earlierItems });
        }

        return groups;
    });

    const fetchRecentItems = () => {
        if (recentItems.value.length > 0) {
            return;
        }
        recentItems.value = mockRecentItems;
    };

    const logRecentAccess = (novel: Novel) => {
        const existingIndex = recentItems.value.findIndex(item => item.novelId === novel.id);

        if (existingIndex !== -1) {
            recentItems.value.splice(existingIndex, 1);
        }

        const newActivity: RecentActivityItem = {
            id: `activity-${novel.id}-${Date.now()}`,
            novelId: novel.id,
            novelTitle: novel.title,
            novelCover: novel.cover,
            editedItemType: 'outline', // 使用一个通用类型
            editedItemName: '进入编辑器',
            editedAt: new Date().toISOString(),
            formattedTime: '刚刚',
        };

        recentItems.value.unshift(newActivity);

        if (recentItems.value.length > RECENTS_QUEUE_LIMIT) {
            recentItems.value.pop();
        }
    };

    return {
        recentItems,
        groupedRecentItems,
        fetchRecentItems,
        logRecentAccess,
    };
});