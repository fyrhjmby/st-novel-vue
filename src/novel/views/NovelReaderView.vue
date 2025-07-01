<template>
  <div class="h-screen w-screen bg-[#FDFCF9] text-[#3a2f2f] flex flex-col relative font-serif">
    <!-- 顶部浮动控件 -->
    <header class="w-full p-4 flex justify-between items-center absolute top-0 left-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <router-link to="/novel/editor" class="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium bg-white/60 backdrop-blur-md rounded-lg shadow-sm border border-gray-100 text-gray-700 hover:bg-white/90 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
        返回编辑
      </router-link>

      <div class="flex items-center gap-1 p-1.5 bg-white/60 backdrop-blur-md rounded-lg shadow-sm border border-gray-100">
        <button class="w-10 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200/50 rounded-md transition-colors" title="目录">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </button>
        <button class="w-10 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200/50 rounded-md transition-colors" title="外观设置">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
        </button>
        <button class="w-10 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200/50 rounded-md transition-colors" title="更多选项">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto px-4 py-8 pt-24">
      <div class="max-w-3xl mx-auto reader-content">
        <h1 class="text-center">第四章：跃迁点</h1>
        <p>控制台的警报声将卡尔文从浅眠中惊醒。他猛地坐直，眼前的屏幕上一片红色闪烁。“发现引力异常，”艾拉的声音冷静得不带一丝情感，“正在接近理论中的跃迁点。这是我们唯一的回家机会。”</p>
        <p>卡尔文的心跳漏了一拍。回家。这个词既熟悉又陌生，像一颗深埋的种子，在这一刻突然破土而出，疯狂生长。他深吸一口气，双手稳稳地放在控制杆上。“艾拉，计算跃迁参数，准备进入。”</p>
        <p>飞船轻微地震动起来，外部装甲在巨大的引力撕扯下发出呻吟。舷窗外，星辰被拉长、扭曲，汇聚成一个绚烂而致命的漩涡。漩涡的中心，是一片纯粹的黑暗，仿佛宇宙的瞳孔，凝视着这艘渺小的飞船。</p>
      </div>
    </main>

    <!-- 底部浮动控件 -->
    <footer class="w-full p-4 text-center text-sm text-gray-500/80 absolute bottom-0 left-0 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 font-sans">
      <p class="mb-2">第四章: 跃迁点</p>
      <div class="w-full max-w-sm mx-auto flex items-center gap-3">
        <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-black/5 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div class="flex-1 h-1.5 bg-gray-500/10 rounded-full">
          <div class="h-1.5 bg-gray-500/60 rounded-full" style="width: 16%;"></div>
        </div>
        <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-black/5 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
      <p class="mt-2">4 / 24</p>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap');

.reader-content h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.25rem; /* 36px */
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #1f2937;
  letter-spacing: 0.05em;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.reader-content p {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.125rem; /* 18px */
  line-height: 2.2;
  color: #374151;
  margin-bottom: 1.75rem;
  text-align: justify;
}
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>