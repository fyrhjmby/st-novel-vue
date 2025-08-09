// src/settings/stores/usageLogsStore.ts

import { defineStore } from 'pinia';
import * as service from '@/settings/services/usageLogsService';
import type { UsageStat, ApiLog, ChartDataPoint } from '@/settings/api/usageLogsApi';

interface UsageLogsState {
    stats: UsageStat[];
    logs: ApiLog[];
    chartData: ChartDataPoint[];
    isLoading: boolean;
    filters: {
        period: '日' | '周' | '月';
        model: string;
        status: string;
    };
    pagination: {
        currentPage: number;
        limit: number;
        totalPages: number;
        totalLogs: number;
    };
}

export const useUsageLogsStore = defineStore('usage-logs', {
    state: (): UsageLogsState => ({
        stats: [],
        logs: [],
        chartData: [],
        isLoading: false,
        filters: {
            period: '月',
            model: '所有模型',
            status: '所有状态',
        },
        pagination: {
            currentPage: 1,
            limit: 5,
            totalPages: 1,
            totalLogs: 0,
        },
    }),

    actions: {
        async fetchUsageData() {
            this.isLoading = true;
            try {
                const params = {
                    ...this.filters,
                    page: this.pagination.currentPage,
                    limit: this.pagination.limit,
                };
                const data = await service.loadUsageData(params);
                this.stats = data.stats;
                this.logs = data.logs;
                this.chartData = data.chartData;
                this.pagination.totalPages = data.totalPages;
                this.pagination.totalLogs = data.totalLogs;
            } catch (error) {
                console.error('Failed to fetch usage data:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async changePeriod(period: '日' | '周' | '月') {
            this.filters.period = period;
            this.pagination.currentPage = 1;
            await this.fetchUsageData();
        },

        async changeFilter(filter: { model?: string; status?: string }) {
            if (filter.model) this.filters.model = filter.model;
            if (filter.status) this.filters.status = filter.status;
            this.pagination.currentPage = 1;
            await this.fetchUsageData();
        },

        async changePage(page: number) {
            if (page > 0 && page <= this.pagination.totalPages) {
                this.pagination.currentPage = page;
                await this.fetchUsageData();
            }
        },
    },
});