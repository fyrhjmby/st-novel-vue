<template>
  <main class="flex-1 bg-white flex flex-col">
    <!-- 顶部栏 -->
    <header class="h-20 px-6 flex items-center justify-between border-b border-gray-200/70 bg-white flex-shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-gray-800">编辑提示词</h1>
          <p class="text-xs text-gray-500 mt-0.5">自动保存于 2 分钟前</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn btn-ghost">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          预览
        </button>
        <button class="btn btn-secondary">
          存为草稿
        </button>
        <button class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          发布提示词
        </button>
      </div>
    </header>

    <!-- 编辑区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧编辑区 -->
      <div class="flex-1 px-8 py-8 overflow-y-auto bg-gray-50/50">
        <!-- 进度指示器 -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-medium text-gray-600">完成度</p>
            <p class="text-sm font-semibold text-green-600">75%</p>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500" style="width: 75%"></div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="card p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-base font-semibold text-gray-800">基本信息</h3>
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">已完成</span>
          </div>
          <div class="space-y-6">
            <div>
              <label class="form-label">标题 <span class="text-red-500">*</span></label>
              <input type="text" value="高情商沟通大师" class="form-input w-full h-11 px-4 text-sm" placeholder="给你的提示词起个响亮的名字">
              <p class="form-help-text">建议使用 2-8 个字的简洁标题</p>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="form-label">分类 <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select class="form-select w-full h-11 px-4 pr-10 text-sm appearance-none">
                    <option>文案写作</option>
                    <option selected>沟通交流</option>
                  </select>
                  <svg class="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <div>
                <label class="form-label">使用场景</label>
                <div class="relative">
                  <select class="form-select w-full h-11 px-4 pr-10 text-sm appearance-none">
                    <option>日常对话</option>
                    <option selected>职场沟通</option>
                  </select>
                  <svg class="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="form-label">简介 <span class="text-red-500">*</span></label>
              <textarea rows="3" class="form-textarea w-full p-4 text-sm resize-y" placeholder="用一句话描述你的提示词能做什么">将任何直白、生硬的表达，转化为礼貌、得体且不失分寸的沟通话术。</textarea>
              <div class="flex items-center justify-between mt-2">
                <p class="form-help-text">清晰的描述有助于其他用户理解和使用</p>
                <p class="text-xs text-gray-500">42 / 100</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示词内容 -->
        <div class="card p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
              </div>
              <h3 class="text-base font-semibold text-gray-800">提示词内容</h3>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn btn-ghost text-xs px-3 py-1.5">AI 优化</button>
              <button class="btn btn-ghost text-xs px-3 py-1.5">导入模板</button>
            </div>
          </div>
          <div class="bg-gray-50/80 rounded-lg border border-gray-200/80">
            <div class="flex items-center gap-1 p-2 border-b border-gray-200/80">
              <button class="px-3 py-1.5 bg-white text-sm font-medium text-gray-800 rounded-md shadow-sm">编辑</button>
              <button class="px-3 py-1.5 text-sm text-gray-500 hover:bg-white/70 rounded-md">预览</button>
            </div>
            <textarea rows="14" class="w-full bg-transparent p-4 text-sm text-gray-800 font-mono leading-relaxed focus:outline-none resize-none" placeholder="在这里输入您的提示词模板..."># Role: 高情商沟通大师
# Profile: 你是一位精通社会心理学和人际关系学的沟通专家，擅长将直白生硬的表达转化为得体礼貌的话术。

## Skills:
- 深谙职场沟通礼仪
- 精通情绪管理技巧
- 擅长换位思考
- 掌握非暴力沟通原则

## Workflow:
1. 分析原始表达：{{原始表达}}
2. 识别潜在问题和改进点
3. 提供3种不同风格的优化建议：
   - 正式场合版本
   - 日常交流版本
   - 亲和友好版本

## Rules:
- 保持原意不变
- 避免过度客套
- 确保表达真诚
- 考虑文化背景

请直接开始分析：
{{原始表达}}</textarea>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <p class="text-xs text-gray-500">已使用 <span class="font-medium text-gray-700">2</span> 个变量</p>
              <button class="text-xs font-medium text-blue-600 hover:underline">管理变量</button>
            </div>
            <p class="text-xs text-gray-500">字数：326</p>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="card p-6">
          <h3 class="text-base font-semibold text-gray-800 mb-6">高级设置</h3>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50/80 rounded-lg">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-xs">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">公开分享</p>
                  <p class="text-xs text-gray-500 mt-0.5">允许其他用户在市场中发现并使用</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="w-80 border-l border-gray-200/70 bg-white p-6 flex-shrink-0 overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-800 mb-4">实时预览</h3>
        <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200/80">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 text-sm mb-1">高情商沟通大师</h4>
              <span class="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">沟通交流</span>
            </div>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">将任何直白、生硬的表达，转化为礼貌、得体且不失分寸的沟通话术。</p>
        </div>

        <div class="space-y-6">
          <div>
            <p class="text-xs font-semibold text-gray-500 mb-2">测试你的提示词</p>
            <div class="bg-gray-50 rounded-lg p-3 space-y-2.5 border border-gray-200/80">
              <input type="text" class="form-input w-full px-3 py-2 text-xs" placeholder="输入测试内容...">
              <button class="w-full btn bg-gray-700 text-white text-xs font-medium hover:bg-gray-800">
                运行测试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// This script block is intentionally left empty.
// You can add logic for data binding and methods here.
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #F3F4F6;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.form-label {
  @apply text-sm font-medium text-gray-700 block mb-2;
}
.form-input, .form-select, .form-textarea {
  @apply bg-white border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 ease-in-out;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  @apply outline-none border-blue-600 ring-2 ring-blue-600/20;
}
.form-help-text {
  @apply text-xs text-gray-500 mt-2;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out px-4 py-2 text-sm;
}
.btn-primary {
  @apply bg-gray-800 text-white shadow-sm hover:bg-gray-900 hover:-translate-y-px;
}
.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50;
}
.btn-ghost {
  @apply bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800;
}
</style>