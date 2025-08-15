<template>
  <main class="flex-1 bg-[#FCFCFC] flex flex-col items-center justify-center p-8 overflow-auto">
    <div v-if="store.isLoading" class="text-center">
      <p class="text-gray-500">正在加载运行配置...</p>
    </div>
    <div v-else class="w-full max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-light text-[#374151]">运行工作流</h1>
        <p class="text-lg text-[#6B7280] mt-1">{{ store.workflowName }}</p>
        <div class="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            预计耗时: ~15秒
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            预计费用: ~$0.02
          </span>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-md mb-6">
        <h3 class="text-base font-medium text-[#374151] mb-4">选择参数预设</h3>
        <div class="grid grid-cols-3 gap-3">
          <button v-for="preset in store.presets" :key="preset.id"
                  class="p-3 border rounded-lg text-sm text-left transition-colors"
                  :class="preset.active ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'">
            <p class="font-medium text-gray-700">{{ preset.name }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ preset.description }}</p>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl p-8 border border-gray-100 shadow-md space-y-6">
        <h3 class="text-base font-medium text-[#374151]">输入参数 (Start 节点)</h3>
        <div>
          <label for="topic" class="text-sm font-medium text-[#374151]">主题 (topic: string)</label>
          <input type="text" id="topic" placeholder="例如：人工智能在创意写作中的应用" v-model="store.formData.topic"
                 class="mt-2 block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 rounded-lg">
          <p class="mt-2 text-xs text-[#9CA3AF]">这是启动工作流所需的核心内容。</p>
          <div class="mt-2 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            <div class="text-xs text-blue-700">
              <p class="font-medium">AI 建议：</p>
              <p>尝试使用更具体的主题，如 "AI如何帮助小说作家克服创作瓶颈"</p>
            </div>
          </div>
        </div>
        <div>
          <label for="platform" class="text-sm font-medium text-[#374151]">目标平台 (platform: string)</label>
          <select id="platform" v-model="store.formData.platform"
                  class="mt-2 block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 rounded-lg">
            <option>推特 (默认)</option>
            <option>博客文章</option>
            <option>领英动态</option>
            <option>Instagram 说明</option>
          </select>
          <div class="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p><strong>推特限制：</strong>280字符，支持话题标签和@提及</p>
          </div>
        </div>

        <details class="border-t border-gray-100 pt-6">
          <summary class="text-sm font-medium text-[#374151] cursor-pointer">高级选项</summary>
          <div class="mt-4 space-y-4">
            <div>
              <label class="text-sm font-medium text-[#374151]">语调风格</label>
              <div class="mt-2 flex gap-2">
                <button v-for="tone in ['专业', '友好', '幽默', '正式']" :key="tone"
                        @click="store.formData.tone = tone"
                        class="px-3 py-1 text-sm rounded-lg"
                        :class="store.formData.tone === tone ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'">{{ tone }}</button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-[#374151]">包含元素</label>
              <div class="mt-2 space-y-2">
                <label class="flex items-center gap-2"><input type="checkbox" v-model="store.formData.includeHashtags" class="rounded text-blue-600"><span class="text-sm text-gray-700">话题标签 (#hashtags)</span></label>
                <label class="flex items-center gap-2"><input type="checkbox" v-model="store.formData.includeEmojis" class="rounded text-blue-600"><span class="text-sm text-gray-700">表情符号</span></label>
                <label class="flex items-center gap-2"><input type="checkbox" v-model="store.formData.includeCTA" class="rounded text-blue-600"><span class="text-sm text-gray-700">行动号召 (CTA)</span></label>
              </div>
            </div>
          </div>
        </details>

        <div class="border-t border-gray-100 pt-6 flex justify-between items-center">
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800">保存为预设</button>
          <div class="flex gap-3">
            <button class="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">测试运行</button>
            <router-link :to="`/workflow/monitor/run-12345`" class="px-8 py-3 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
              开始运行
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-700 mb-3">最近使用的参数</h4>
        <div class="space-y-2">
          <button v-for="item in store.recentParams" :key="item.id" class="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-gray-700">{{ item.title }}</p>
                <p class="text-xs text-gray-500">{{ item.details }}</p>
              </div>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRunStore } from '@/workflow/stores/runStore';

const props = defineProps<{
  id: string;
}>();

const store = useRunStore();

onMounted(() => {
  store.loadRunData(props.id);
});
</script>