import type { Conversation } from '@/novel/editor/types/chatTypes';

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
                content: '我想讨论一下卡尔文这个角色的内心世界。在面对跃迁点时，他应该有什么样的心理活动？',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 'msg-2',
                role: 'ai',
                content: `<p class="mb-3">当然，这是一个很好的切入点。卡尔文在面对跃迁点时的心理活动可以从多个层面展现：</p><ol class="list-decimal list-inside space-y-2"><li><strong>希望与恐惧的交织</strong>：跃迁点代表着回家的可能，但也意味着巨大的未知风险。可以描写他手心出汗，但眼神却异常明亮。</li><li><strong>孤独感的顶峰</strong>：在做出这个重大决定时，他比任何时候都更加意识到自己的孤独。没有战友，只有AI。</li><li><strong>对过去的眷恋</strong>："回家"这个词会触发他的记忆闸门，可以闪回一些与家人或恋人的片段。</li></ol>`,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000).toISOString(),
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