<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
      <div class="mb-8 text-center">
        <h2 class="text-xl font-semibold text-[#374151]">创建你的新故事</h2>
        <p class="text-sm text-[#9CA3AF] mt-2">为你的世界打下第一个基石</p>
      </div>

      <div class="space-y-6">
        <div>
          <label for="novel-title" class="block text-sm font-medium text-[#374151] mb-1.5">小说标题</label>
          <input
              type="text"
              id="novel-title"
              placeholder="例如：星际漫游者"
              class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
        </div>
        <div>
          <label for="novel-synopsis" class="block text-sm font-medium text-[#374151] mb-1.5">小说简介 (可选)</label>
          <textarea
              id="novel-synopsis"
              rows="4"
              placeholder="简单描述一下你的故事，这将帮助AI更好地理解你的创作意图。"
              class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] leading-relaxed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
          ></textarea>
        </div>
        <div>
          <label for="novel-category" class="block text-sm font-medium text-[#374151] mb-1.5">小说分类</label>
          <select id="novel-category" class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-[#374151] w-full">
            <option>选择一个分类</option>
            <option>科幻</option>
            <option>奇幻</option>
            <option>都市</option>
            <option>言情</option>
            <option>悬疑</option>
            <option>历史</option>
          </select>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end items-center gap-4">
        <router-link to="/novel/dashboard" class="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">
          取消
        </router-link>
        <button class="px-6 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"></path></svg>
          <span>创建小说</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic for creating a new novel will be implemented here
</script>

<style scoped>
</style>