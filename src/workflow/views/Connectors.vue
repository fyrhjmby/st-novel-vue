// =
// 文件: ..\src\workflow\views\Connectors.vue
//

<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-medium text-[#374151]">连接器</h1>
        <p class="text-sm text-[#9CA3AF] mt-1">管理和发现第三方应用集成</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input type="text" placeholder="搜索连接器..."
                 class="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all">
          <svg class="w-5 h-5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </div>
        <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          请求新连接
        </button>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-6">
        <button @click="activeTab = 'explore'" :class="['py-3 px-1 border-b-2 font-medium text-sm', activeTab === 'explore' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
          发现连接器
        </button>
        <button @click="activeTab = 'my'" :class="['py-3 px-1 border-b-2 font-medium text-sm', activeTab === 'my' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
          我的连接 ({{ myConnections.length }})
        </button>
      </nav>
    </div>

    <!-- 发现连接器内容 -->
    <div v-if="activeTab === 'explore'">
      <div v-for="category in availableConnectors" :key="category.name" class="mb-8">
        <h3 class="text-base font-medium text-[#374151] mb-4">{{ category.name }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="connector in category.items" :key="connector.name" class="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" :class="connector.bgClass">
              <span v-html="connector.icon"></span>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-[#374151]">{{ connector.name }}</h4>
              <p class="text-sm text-[#9CA3AF] mt-1 mb-3">{{ connector.description }}</p>
              <button class="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">
                连接
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的连接内容 -->
    <div v-if="activeTab === 'my'">
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">应用</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">账户</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">添加于</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="conn in myConnections" :key="conn.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" :class="conn.bgClass">
                  <span v-html="conn.icon"></span>
                </div>
                <span class="font-medium text-sm text-[#374151]">{{ conn.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ conn.account }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full" :class="conn.status.class">
                  <span class="w-2 h-2 rounded-full" :class="conn.status.dotClass"></span>
                  {{ conn.status.text }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ conn.addedDate }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button v-if="conn.status.action" class="text-yellow-600 hover:text-yellow-800 mr-4">{{ conn.status.action }}</button>
              <button class="text-red-600 hover:text-red-800">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('explore');

const availableConnectors = ref([
  {
    name: 'AI 模型',
    items: [
      { name: 'OpenAI', description: '集成 GPT-4, DALL·E 等模型', icon: '<svg class="w-6 h-6" viewBox="0 0 41 41"><path fill-rule="evenodd" clip-rule="evenodd" d="M37.532 20.264c0 9.56-7.74 17.299-17.297 17.299C10.678 37.563 2.94 29.823 2.94 20.264c0-9.56 7.739-17.3 17.297-17.3 9.558 0 17.297 7.74 17.297 17.3zM13.11 16.143c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933v-1.89H9.28v1.89H7.347a.755.755 0 00-.765.747c0 .414.345.747.765.747h1.933v1.89h1.896v-1.89h1.934zm3.645-3.633c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933v-1.89h-1.896v1.89H9.28v1.89h1.896V9.263h1.933v1.89h1.934v1.89zm1.896-1.89c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933V9.263h-1.896v1.89H13.11v1.89h1.896v-1.89h1.933v-1.89h1.61zm3.825-1.933c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933V4.79h-1.896v1.89h-1.933v1.89h1.933v1.89h1.896v-1.89h1.933V8.68h1.61zm3.74 1.89c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.932V7.93h-1.896v1.89h-1.934v1.89h1.934v1.89h1.896v-1.89h1.932v-1.89h1.611zm3.778 1.933c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933v-1.89h-1.896v1.89h-1.933v1.89h1.933v1.89h1.896v-1.89h1.933v-1.89h1.611zm1.897 1.89c.42 0 .765-.333.765-.747a.755.755 0 00-.765-.747h-1.933V9.82h-1.896v1.89H28.09v1.89h1.896v1.89h1.896v-1.89h1.933v-1.89h1.611z" fill="#fff"></path></svg>', bgClass: 'bg-black' },
      { name: 'Anthropic', description: '集成 Claude 3 系列模型', icon: '<svg class="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 256 256"><path d="M208,24H48A24,24,0,0,0,24,48V208a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V48A24,24,0,0,0,208,24Zm-29.07,152H145.34a8,8,0,0,1-6.4-12.8l20.1-26.8a8,8,0,0,0-6.4-12.8H113.88c-12.33,0-23,8.49-26.68,20.35s.8,24.11,10.29,31.48l30.95,24.76A23.85,23.85,0,0,0,147.28,200c12.18,0,22.42-8.58,25.86-20.11S169,155.13,159.21,148.4l-11-8.25a8,8,0,0,1-1.6-11.59,8,8,0,0,1,11.59-1.6l11,8.25c12.42,9.31,29.45,5.43,38.76-7A24,24,0,0,0,178.93,176Z"/></svg>', bgClass: 'bg-gray-100' },
    ]
  },
  {
    name: '存储与文档',
    items: [
      { name: 'Google Drive', description: '读写文件、创建文件夹', icon: '<svg class="w-6 h-6" viewBox="0 0 512 512"><path fill="#3777e3" d="M180.9 399.1l-61.8 107.1L30 399.1h150.9z"/><path fill="#ffc107" d="M30 399.1L121.5 239H30v160.1z"/><path fill="#109d58" d="M121.5 239l62.1 107.6l61.8-107.6H121.5z"/><path fill="#3777e3" d="M303.1 399.1l-61.8 107.1L150 399.1h153.1z"/><path fill="#ffc107" d="M482 399.1L390.5 239H482v160.1z"/><path fill="#109d58" d="M390.5 239l-62.1 107.6l-61.8-107.6h123.9z"/><path fill="#f44336" d="M390.5 239H121.5l94.5-163.7L390.5 239z"/></svg>', bgClass: 'bg-gray-50' },
      { name: 'Dropbox', description: '同步文件和文件夹', icon: '<svg class="w-6 h-6" fill="#0061ff" viewBox="0 0 24 24"><path d="M12 4.4L7.6 7.2v5.6l4.4 2.8 4.4-2.8V7.2L12 4.4zM7.6 7.2L3.2 10l4.4 2.8v5.6l4.4 2.8V15.6L7.6 12.8v-5.6zm8.8 0L20.8 10l-4.4 2.8v5.6l-4.4 2.8V15.6l4.4-2.8v-5.6z"/></svg>', bgClass: 'bg-gray-50' },
    ]
  },
  {
    name: '通讯',
    items: [
      { name: 'Slack', description: '发送消息、创建频道', icon: '<svg class="w-6 h-6" fill="#4a154b" viewBox="0 0 128 128"><path d="M22.11 68.32a9.66 9.66 0 110-19.32a9.66 9.66 0 010 19.32"/><path d="M31.78 68.32a9.66 9.66 0 1119.32 0V49a9.66 9.66 0 01-19.32 0v19.32z" fill="#36c5f0"/><path d="M59.68 22.11a9.66 9.66 0 1119.32 0a9.66 9.66 0 01-19.32 0"/><path d="M59.68 31.78a9.66 9.66 0 110 19.32h19.32a9.66 9.66 0 010-19.32H59.68z" fill="#2eb67d"/><path d="M105.89 59.68a9.66 9.66 0 110 19.32a9.66 9.66 0 010-19.32"/><path d="M96.22 59.68a9.66 9.66 0 11-19.32 0v19.32a9.66 9.66 0 0119.32 0V59.68z" fill="#ecb22e"/><path d="M68.32 105.89a9.66 9.66 0 11-19.32 0a9.66 9.66 0 0119.32 0"/><path d="M68.32 96.22a9.66 9.66 0 110-19.32H49a9.66 9.66 0 010 19.32h19.32z" fill="#e01e5a"/></svg>', bgClass: 'bg-gray-50' },
      { name: 'Gmail', description: '发送和读取邮件', icon: '<svg class="w-6 h-6" viewBox="0 0 24 24"><path d="M22 5.88V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-.3.1-.6.2-.8l10 6.5l10-6.5c.1.2.2.5.2.8zM21.1 4.14L12 10.7L2.9 4.14A2 2 0 0 1 4 4h16a2 2 0 0 1 1.1.14z" fill="#ea4335"/><path fill="#4285f4" d="M2 18V6c0-.3.1-.6.2-.8l8.8 5.7V20H4a2 2 0 0 1-2-2z"/><path fill="#34a853" d="M22 18V6c0-.3-.1-.6-.2-.8l-8.8 5.7V20h8a2 2 0 0 0 2-2z"/><path fill="#fbbc04" d="M12 10.7l8.8-5.73A2 2 0 0 0 20 4H4a2 2 0 0 0-1.1.14L12 10.7z"/></svg>', bgClass: 'bg-gray-50' },
    ]
  },
]);

const myConnections = ref([
  {
    id: 'conn-01',
    name: 'OpenAI',
    account: '个人API Key',
    status: { text: '已连接', class: 'bg-green-100 text-green-800', dotClass: 'bg-green-500' },
    addedDate: '2024-05-10',
    icon: availableConnectors.value[0].items[0].icon,
    bgClass: availableConnectors.value[0].items[0].bgClass
  },
  {
    id: 'conn-02',
    name: 'Google Drive',
    account: 'zhang.xiaoming@example.com',
    status: { text: '需要重新授权', class: 'bg-yellow-100 text-yellow-800', dotClass: 'bg-yellow-500', action: '重新连接' },
    addedDate: '2024-04-22',
    icon: availableConnectors.value[1].items[0].icon,
    bgClass: availableConnectors.value[1].items[0].bgClass
  },
  {
    id: 'conn-03',
    name: 'Slack',
    account: '我的工作区',
    status: { text: '已连接', class: 'bg-green-100 text-green-800', dotClass: 'bg-green-500' },
    addedDate: '2024-03-15',
    icon: availableConnectors.value[2].items[0].icon,
    bgClass: availableConnectors.value[2].items[0].bgClass
  },
]);
</script>