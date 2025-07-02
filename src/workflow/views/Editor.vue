<template>
  <div class="flex flex-col h-full w-full bg-white">
    <div class="px-8 py-3 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <div>
        <p class="text-sm text-[#9CA3AF]">我的工作流 / 编辑中</p>
        <h1 class="text-base font-medium text-[#374151] mt-1">社交媒体帖子生成器</h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400 mr-2">所有更改已保存</span>
        <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/>
          </svg>
        </button>
        <div class="w-px h-5 bg-gray-200 mx-2"></div>
        <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v11.494m-9-5.747h18"/>
          </svg>
        </button>
        <label class="relative inline-flex items-center cursor-pointer ml-4">
          <input type="checkbox" class="sr-only peer">
          <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          <span class="ms-2 text-sm font-medium text-gray-700">调试</span>
        </label>
        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
          测试
        </button>
        <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          发布
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-72 bg-white border-r border-gray-100 flex flex-col p-4">
        <div class="relative mb-4">
          <input type="text" placeholder="搜索组件..." class="w-full pl-9 pr-4 py-2 text-sm bg-[#F3F4F6] border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none">
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
        </div>
        <div class="flex bg-gray-100 rounded-lg p-1 mb-4 text-sm">
          <button class="flex-1 py-1 px-2 bg-white rounded-md text-gray-700 font-medium">全部</button>
          <button class="flex-1 py-1 px-2 text-gray-500">常用</button>
          <button class="flex-1 py-1 px-2 text-gray-500">最近</button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-6 -mr-2 pr-2">
          <div v-for="category in nodeCategories" :key="category.title">
            <div class="flex items-center justify-between px-2 mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase">{{ category.title }}</p>
              <span v-if="category.isNew" class="tag-new">HOT</span>
            </div>
            <div class="space-y-1">
              <div v-for="node in category.nodes" :key="node.name" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-grab draggable-node">
                <div class="w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center" :class="node.bgClass">
                  <span v-html="node.icon"></span>
                </div>
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700">{{ node.name }}</span>
                  <p class="text-xs text-gray-400">{{ node.description }}</p>
                </div>
                <span v-if="node.count" class="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{{ node.count }}</span>
                <span v-if="node.isNew" class="tag-new">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Canvas -->
      <main class="flex-1 workflow-canvas-bg relative">
        <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#D1D5DB" /></marker>
          </defs>
          <g class="relative group">
            <path d="M 270 120 C 330 120, 330 262, 394 262" stroke="#D1D5DB" stroke-width="2" fill="none" marker-end="url(#arrowhead)" class="connection-line"/>
            <foreignObject x="322" y="176" width="40" height="40" class="pointer-events-auto cursor-pointer">
              <div class="flex items-center justify-center h-full">
                <div class="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 group-hover:bg-white group-hover:shadow-lg transition-all"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/></svg></div>
              </div>
            </foreignObject>
          </g>
          <path d="M 570 262 C 630 262, 630 402, 690 402" stroke="#D1D5DB" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
        </svg>

        <!-- Nodes -->
        <div class="absolute group" style="top: 80px; left: 80px; z-index: 10;">
          <div class="w-64 bg-white rounded-xl shadow-md border border-gray-200">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="p-1 rounded-md bg-green-100 text-green-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg></div>
                <p class="font-medium text-sm text-[#374151]">开始</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <button class="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></button>
              </div>
            </div>
            <div class="p-4 text-xs text-gray-500 space-y-1.5">
              <div><p class="font-medium text-gray-600">topic</p><p class="text-gray-400">用户输入的主题</p></div>
              <div><p class="font-medium text-gray-600">platform</p><p class="text-gray-400">目标社交平台</p></div>
            </div>
            <div class="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors"></div>
          </div>
        </div>
        <div class="absolute group" style="top: 220px; left: 390px; z-index: 10;">
          <div class="w-64 bg-white rounded-xl shadow-md border-2 border-blue-500">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="p-1 rounded-md bg-blue-100 text-blue-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg></div>
                <p class="font-medium text-sm text-[#374151]">大语言模型</p>
              </div>
              <button class="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></button>
            </div>
            <div class="p-4 text-xs text-gray-500">
              <p class="truncate">模型: GPT-4-Turbo</p>
              <p class="text-gray-400 mt-1 truncate">Prompt: "你是一个社交媒体专家..."</p>
              <div class="mt-2 flex items-center justify-between text-xs"><span class="text-gray-400">Token预估</span><span class="text-blue-600 font-medium">~850</span></div>
            </div>
            <div class="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors"></div>
            <div class="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors"></div>
          </div>
        </div>
        <div class="absolute group" style="top: 360px; left: 690px; z-index: 10;">
          <div class="w-64 bg-white rounded-xl shadow-md border border-gray-200">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="p-1 rounded-md bg-red-100 text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg></div>
                <p class="font-medium text-sm text-[#374151]">结束</p>
              </div>
            </div>
            <div class="p-4 text-xs text-gray-500 space-y-1.5"><div><p class="font-medium text-gray-600">post_content</p><p class="text-gray-400">生成的帖子内容</p></div></div>
            <div class="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-gray-100 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors"></div>
          </div>
        </div>

        <!-- Canvas Controls -->
        <div class="absolute bottom-6 right-6 bg-white rounded-lg shadow-md border border-gray-200 flex items-center p-1 space-x-1">
          <button class="p-2 rounded-md hover:bg-gray-100 text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6"/></svg></button>
          <span class="text-xs text-gray-500 font-semibold w-12 text-center">100%</span>
          <button class="p-2 rounded-md hover:bg-gray-100 text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-6-6h12"/></svg></button>
          <div class="w-px h-5 bg-gray-200 mx-1"></div>
          <button class="p-2 rounded-md hover:bg-gray-100 text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5M4.5 18.75l7.5-7.5 7.5 7.5"/></svg></button>
          <div class="w-px h-5 bg-gray-200 mx-1"></div>
          <button class="p-2 rounded-md hover:bg-gray-100 text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg></button>
        </div>

        <!-- Minimap -->
        <div class="absolute bottom-6 left-6 bg-white rounded-lg shadow-md border border-gray-200 p-2 w-32 h-24">
          <div class="relative w-full h-full bg-gray-50 rounded">
            <div class="absolute top-2 left-2 w-2 h-2 bg-green-500 rounded-sm"></div>
            <div class="absolute top-6 left-8 w-2 h-2 bg-blue-500 rounded-sm"></div>
            <div class="absolute bottom-2 right-2 w-2 h-2 bg-red-500 rounded-sm"></div>
            <div class="absolute inset-0 border-2 border-gray-400 rounded opacity-50" style="width: 40%; height: 40%; top: 10%; left: 10%;"></div>
          </div>
        </div>
      </main>

      <!-- 右侧节点配置面板 -->
      <aside class="w-96 bg-white border-l border-gray-100 flex flex-col">
        <div class="p-6 border-b border-gray-100">
          <h3 class="font-medium text-[#374151]">配置 "大语言模型"</h3>
          <p class="text-sm text-[#9CA3AF] mt-1">自定义LLM节点的行为和参数</p>
        </div>
        <div class="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">模型</p>
            <select class="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 rounded-lg">
              <option>GPT-4-Turbo (推荐)</option><option>Claude 3 Sonnet</option><option>Gemini Pro</option>
            </select>
            <div class="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <div class="flex justify-between mb-1"><span>速度</span><div class="flex gap-1"><span class="w-1 h-3 bg-blue-500 rounded-sm"></span><span class="w-1 h-3 bg-blue-500 rounded-sm"></span><span class="w-1 h-3 bg-blue-500 rounded-sm"></span><span class="w-1 h-3 bg-gray-300 rounded-sm"></span><span class="w-1 h-3 bg-gray-300 rounded-sm"></span></div></div>
              <div class="flex justify-between"><span>成本</span><span class="font-medium">$0.01 / 1K tokens</span></div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">参数设置</p>
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-600">Temperature</label>
                <div class="flex items-center gap-3 mt-1"><input type="range" min="0" max="2" step="0.1" value="0.7" class="flex-1"><span class="text-sm font-medium text-gray-700 w-8">0.7</span></div>
              </div>
              <div><label class="text-sm text-gray-600">Max Tokens</label><input type="number" value="1000" class="mt-1 block w-full text-sm border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 p-2"></div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">输入变量</p>
            <div class="space-y-2">
              <div class="bg-gray-50 rounded-lg p-3 text-sm flex items-center justify-between">
                <div class="flex items-center gap-2"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg><span class="text-gray-800 font-medium">topic</span></div>
                <div class="flex items-center gap-2 text-xs bg-white border border-gray-200 rounded-md p-1.5"><svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg><span class="font-mono text-gray-600">start.topic</span></div>
              </div>
              <button class="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600">+ 添加输入变量</button>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5">
            <div class="flex items-center justify-between mb-3"><p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">提示词 (Prompt)</p><button class="text-xs text-blue-600 hover:text-blue-700">从模板库选择</button></div>
            <textarea rows="8" class="block w-full text-sm border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 font-mono p-3 leading-relaxed" placeholder="使用 {{变量}} 来引用输入">{system_prompt}
你是一个社交媒体专家，请根据以下主题为推特平台生成一篇帖子:
{{topic}}</textarea>
            <div class="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
              <p class="font-medium mb-1">优化建议：</p>
              <ul class="space-y-1 ml-4 list-disc"><li>可以添加 "保持字数在280字以内" 的限制</li><li>建议加入目标受众描述</li></ul>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5"><p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">输出变量</p><input type="text" value="post_content" class="block w-full text-sm border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 p-2.5 font-mono"></div>

          <details class="border-t border-gray-200 pt-5">
            <summary class="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer">高级设置</summary>
            <div class="mt-4 space-y-4"><label class="flex items-center gap-2"><input type="checkbox" class="rounded text-blue-600"><span class="text-sm text-gray-700">启用流式输出</span></label><label class="flex items-center gap-2"><input type="checkbox" class="rounded text-blue-600"><span class="text-sm text-gray-700">保存对话历史</span></label></div>
          </details>
        </div>
      </aside>
    </div>

    <div class="h-12 border-t border-gray-100 px-8 flex items-center gap-6 bg-gray-50 flex-shrink-0">
      <span class="text-xs font-medium text-gray-500">全局变量：</span>
      <div class="flex items-center gap-4"><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{{user_id}}</span><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{{timestamp}}</span><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{{api_key}}</span></div>
      <button class="ml-auto text-xs text-blue-600 hover:text-blue-700">管理变量</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const nodeCategories = ref([
  {
    title: '核心',
    nodes: [
      { name: '开始', description: '工作流入口', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg>`, bgClass: 'bg-green-100' },
      { name: '结束', description: '输出结果', icon: `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`, bgClass: 'bg-red-100' },
    ],
  },
  {
    title: '大语言模型',
    isNew: true,
    nodes: [
      { name: 'LLM', description: '文本生成', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`, bgClass: 'bg-blue-100', count: 12 },
      { name: '知识库检索', description: 'RAG增强', icon: `<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"/></svg>`, bgClass: 'bg-indigo-100' },
      { name: '对话历史', description: '上下文管理', icon: `<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`, bgClass: 'bg-purple-100', isNew: true },
    ],
  },
  {
    title: '工具',
    nodes: [
      { name: '翻译', description: '多语言支持', icon: `<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 10.033 14.1 12c0 1.967-.918 4.939-2.766 6.364M14.1 12l-5.454-2.271"/></svg>`, bgClass: 'bg-amber-100' },
      { name: '文生图', description: 'DALL·E 3', icon: `<svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>`, bgClass: 'bg-sky-100' },
    ],
  },
  {
    title: '控制流',
    nodes: [
      { name: '条件判断', description: 'IF/ELSE逻辑', icon: `<svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`, bgClass: 'bg-orange-100' },
      { name: '循环', description: '批量处理', icon: `<svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`, bgClass: 'bg-rose-100' },
    ],
  },
]);
</script>