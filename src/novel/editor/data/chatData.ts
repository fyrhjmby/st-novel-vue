import type { Conversation } from '../types';

export const mockChatConversations: Conversation[] = [
    {
        id: 'conv-1',
        title: '角色性格讨论',
        summary: '关于卡尔文的内心世界...',
        createdAt: '2小时前',
        messages: [
            {
                id: 'msg-1',
                role: 'user',
                content: '我想讨论一下卡尔文这个角色的内心世界。',
                timestamp: new Date().toISOString(),
            },
            {
                id: 'msg-2',
                role: 'ai',
                content: `<p>当然，这是一个很好的切入点。</p>`,
                timestamp: new Date().toISOString(),
            }
        ]
    },
    {
        id: 'conv-2',
        title: '情节灵感',
        summary: '跃迁点的科学原理...',
        createdAt: '昨天',
        messages: []
    }
];