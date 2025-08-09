// src/settings/services/helpCenterService.ts

import * as api from '@/settings/api/helpCenterApi';

export const loadHelpCenterData = async () => {
    console.log('Service: Loading help center data...');
    return await api.fetchHelpData();
};