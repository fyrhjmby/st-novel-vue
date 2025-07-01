<template>
  <aside class="w-96 bg-[#FAFAFA] border-l border-gray-100 flex flex-col flex-shrink-0">
    <div class="h-1/3 p-4 border-b border-gray-200 flex flex-col">
      <div class="flex items-center justify-between mb-3 flex-shrink-0 px-2">
        <h3 class="font-medium text-sm text-gray-700">AI任务队列</h3>
        <span class="text-xs font-medium px-2 py-0.5 rounded-full text-blue-700 bg-blue-100">2个活跃</span>
      </div>
      <div class="flex-grow space-y-2 overflow-y-auto text-sm pr-1 hide-scrollbar">
        <div class="p-3 bg-red-50 rounded-lg border border-red-200">
          <div class="flex justify-between items-center mb-1">
            <p class="font-medium text-sm text-gray-800">润色"第四章"</p>
            <span class="text-xs text-red-600 font-semibold flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
              失败
            </span>
          </div>
          <p class="text-xs text-red-700 mt-1">生成超时，请检查网络后 <a href="#" class="underline font-medium">重试</a>。</p>
        </div>
        <div class="p-3 bg-white rounded-lg border border-l-4 border-l-blue-500 shadow-sm">
          <div class="flex justify-between items-center mb-1">
            <p class="font-medium text-sm text-gray-800">扩写"第五章"大纲</p>
            <span class="text-xs text-blue-600 font-semibold">进行中...</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div class="bg-blue-500 h-1.5 rounded-full" style="width: 75%"></div></div>
          <p class="text-xs text-gray-500 mt-1.5">预计还需 15秒</p>
        </div>
        <div class="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
          <div class="flex justify-between items-center">
            <p class="font-medium text-sm text-gray-800">角色对话分析</p>
            <span class="text-xs text-green-600 font-semibold">已完成</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">点击查看结果</p>
        </div>
      </div>
    </div>

    <div class="h-2/3 p-4 flex flex-col">
      <div class="flex items-center justify-between mb-3 flex-shrink-0 px-2">
        <h3 class="font-medium text-sm text-gray-700">AI生成预览 (差异对比)</h3>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
            应用修改
          </button>
        </div>
      </div>
      <div class="flex-grow bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto text-sm leading-relaxed">
        <p>
          警报的<del class="diff-del">声将卡尔文从浅眠中惊醒</del><ins class="diff-add">尖啸犹如一把利刃，划破了卡尔文短暂的假寐</ins>。他猛<del class="diff-del">地坐直</del><ins class="diff-add">然挺直身躯</ins>，<ins class="diff-add">猩红的警示灯在他眼中投下不祥的光晕</ins>。<del class="diff-del">眼前的屏幕上一片红色闪烁</del>。"发现引力异常，"艾拉的<del class="diff-del">声音冷静得不带一丝情感</del><ins class="diff-add">合成音毫无波澜，却字字千钧</ins>，"我们正<del class="diff-del">在接近</del><ins class="diff-add">迫近一个</ins>理论中的<del class="diff-del">跃迁点。</del><ins class="diff-add">时空奇点——跃迁点。根据数据库推演，这或许是返回太阳系的唯一路径。</ins>"
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// AI panel logic will be added here in the future.
</script>

<style scoped>
.diff-del {
  background-color: #FEE2E2;
  text-decoration: line-through;
  text-decoration-color: #EF4444;
  color: #B91C1C;
  padding: 0 2px;
  border-radius: 3px;
}
.diff-add {
  background-color: #D1FAE5;
  text-decoration: none;
  color: #065F46;
  padding: 0 2px;
  border-radius: 3px;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>