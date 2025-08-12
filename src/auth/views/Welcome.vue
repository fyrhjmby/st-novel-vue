

<template>
  <div class="w-full max-w-6xl mx-auto py-8">
    <div class="welcome-hero">
      <div class="relative z-10">
        <h1 class="text-4xl font-light mb-4">欢迎来到 AI Creator Platform</h1>
        <p class="text-xl text-gray-200 mb-8">释放创意，探索无限可能</p>
        <div class="flex gap-4 justify-center">
          <router-link to="/auth/register" class="px-6 py-3 bg-white text-[#374151] rounded-lg font-medium hover:bg-gray-100 transition-colors">
            开始使用
          </router-link>
          <router-link to="/auth/login" class="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur">
            登录账户
          </router-link>
        </div>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <div class="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-[#4B5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>
        </div>
        <h3 class="text-lg font-medium text-[#374151] mb-2">智能创作</h3>
        <p class="text-sm text-[#6B7280]">基于最先进的 AI 模型，为您提供强大的创作辅助能力</p>
      </div>
      <div class="feature-card">
        <div class="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-[#4B5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg></div>
        <h3 class="text-lg font-medium text-[#374151] mb-2">多样化场景</h3>
        <p class="text-sm text-[#6B7280]">支持文章、小说、剧本等多种创作场景</p>
      </div>
      <div class="feature-card">
        <div class="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-[#4B5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 3V15M9 15L5 11M9 15L13 11"/><path d="M15 21V9M15 9L19 13M15 9L11 13"/></svg></div>
        <h3 class="text-lg font-medium text-[#374151] mb-2">灵活工作流</h3>
        <p class="text-sm text-[#6B7280]">自定义创作流程，打造属于您的创作体验</p>
      </div>
      <div class="feature-card">
        <div class="w-12 h-12 bg-[#F3F4F6] rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-[#4B5563]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15V15.01M12 9V3M7 9C4.5 9 3 10.5 3 13C3 15.5 5 17 7 17H17C19.5 17 21 15.5 21 13C21 10.5 19.5 9 17 9C17 6.2 14.8 4 12 4C10.5 4 9.2 4.6 8.2 5.5"/></svg></div>
        <h3 class="text-lg font-medium text-[#374151] mb-2">云端同步</h3>
        <p class="text-sm text-[#6B7280]">随时随地访问您的创作，跨设备无缝同步</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component is primarily for presentation, logic is handled by navigation.
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #E5E7EB;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: #D1D5DB;
  box-shadow: var(--shadow-md);
}

.welcome-hero {
  background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
  color: white;
  padding: 48px;
  text-align: center;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.welcome-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(45deg);
}
</style>