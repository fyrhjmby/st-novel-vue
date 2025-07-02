<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面操作栏 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-medium text-[#374151]">我的工作流</h1>
        <p class="text-sm text-[#9CA3AF] mt-1">管理您所有的自动化流程</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- 搜索框 -->
        <div class="relative">
          <input type="text" placeholder="搜索我的工作流..."
                 class="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all">
          <svg class="w-5 h-5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </div>
        <select class="text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all py-2 px-3">
          <option>按修改日期排序</option>
          <option>按创建日期排序</option>
          <option>按名称排序</option>
        </select>
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
          <button @click="viewMode = 'grid'" class="p-1.5 rounded-md" :class="{'bg-white shadow-sm': viewMode === 'grid'}">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </button>
          <button @click="viewMode = 'list'" class="p-1.5 rounded-md" :class="{'bg-white shadow-sm': viewMode === 'list'}">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"/></svg>
          </button>
        </div>
        <!-- 创建按钮 -->
        <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5V19M5 12H19"/>
          </svg>
          创建工作流
        </button>
      </div>
    </div>

    <!-- 网格视图 -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="flow in myWorkflows" :key="flow.id" class="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col group">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-medium text-[#374151] leading-tight">{{ flow.title }}</h3>
          <span class="flex-shrink-0 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" :class="flow.status.class">
            <span class="w-2 h-2 rounded-full" :class="flow.status.dotClass"></span>
            {{ flow.status.text }}
          </span>
        </div>
        <p class="text-sm text-[#9CA3AF] mb-4 flex-1">{{ flow.description }}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-for="tag in flow.tags" :key="tag" class="text-xs text-[#4B5563] bg-[#F3F4F6] px-2 py-1 rounded-md">{{ tag }}</span>
        </div>
        <div class="flex items-center justify-between border-t border-gray-100 pt-4">
          <div class="text-xs text-[#9CA3AF]">修改于 {{ flow.updated }}</div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="编辑">
              <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"/></svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="复制">
              <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="删除">
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">运行</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">名称</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">最后修改</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">标签</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="flow in myWorkflows" :key="flow.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-[#374151]">{{ flow.title }}</div>
            <div class="text-xs text-[#9CA3AF] mt-1">{{ flow.description }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full" :class="flow.status.class">
                  <span class="w-2 h-2 rounded-full" :class="flow.status.dotClass"></span>
                  {{ flow.status.text }}
                </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ flow.updated }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex flex-wrap gap-1">
              <span v-for="tag in flow.tags" :key="tag" class="text-xs text-[#4B5563] bg-[#F3F4F6] px-1.5 py-0.5 rounded-md">{{ tag }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-[#3B82F6] hover:text-blue-700 mr-3">运行</button>
            <button class="text-[#3B82F6] hover:text-blue-700">编辑</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const viewMode = ref('grid'); // 'grid' or 'list'

const myWorkflows = ref([
  {
    id: 'wf-001',
    title: '社交媒体帖子生成器',
    description: '自动从核心主题生成适用于多平台的帖子内容。',
    tags: ['内容生成', '社交媒体', 'GPT-4'],
    status: { text: '已发布', class: 'bg-green-100 text-green-800', dotClass: 'bg-green-500' },
    updated: '2天前'
  },
  {
    id: 'wf-002',
    title: '公司周报摘要',
    description: '上传多个文档，自动提取关键信息生成周报摘要。',
    tags: ['文档处理', '信息提取', 'RAG'],
    status: { text: '草稿', class: 'bg-gray-100 text-gray-800', dotClass: 'bg-gray-400' },
    updated: '5小时前'
  },
  {
    id: 'wf-003',
    title: '市场情绪分析流程',
    description: '监控指定关键词的社媒情绪，并每日发送报告。',
    tags: ['数据分析', '监控', '自动化'],
    status: { text: '已发布', class: 'bg-green-100 text-green-800', dotClass: 'bg-green-500' },
    updated: '1周前'
  },
  {
    id: 'wf-004',
    title: '新客户欢迎邮件',
    description: '当有新用户注册时，自动触发个性化欢迎邮件。',
    tags: ['营销', '自动化', 'Email'],
    status: { text: '已归档', class: 'bg-yellow-100 text-yellow-800', dotClass: 'bg-yellow-500' },
    updated: '1个月前'
  },
]);

</script>