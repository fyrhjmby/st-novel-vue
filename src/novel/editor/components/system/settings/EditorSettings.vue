<template>
  <div class="setting-page-wrapper">
    <div class="page-header">
      <h2 class="page-title">编辑器设置</h2>
      <p class="page-description">自定义您的写作环境的外观和行为。</p>
    </div>

    <div class="setting-group">
      <div class="setting-item">
        <label for="font-size" class="setting-label">字体大小</label>
        <div class="setting-control">
          <input id="font-size" type="number" value="16" class="setting-input w-24" />
          <p class="setting-description">编辑器中文本的默认字体大小（单位：像素）。</p>
        </div>
      </div>
      <div class="setting-item">
        <label for="line-height" class="setting-label">行高</label>
        <div class="setting-control">
          <input id="line-height" type="number" step="0.1" value="1.8" class="setting-input w-24" />
          <p class="setting-description">编辑器中每行文本的高度（相对于字体大小的倍数）。</p>
        </div>
      </div>
      <div class="setting-item">
        <label for="autosave" class="setting-label">自动保存</label>
        <div class="setting-control">
          <div class="flex items-center">
            <input id="autosave" type="checkbox" checked class="setting-checkbox" />
            <label for="autosave" class="ml-3 font-medium text-gray-700">启用自动保存</label>
          </div>
          <p class="setting-description">在您停止输入后，系统将自动保存您的更改。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.setting-page-wrapper { padding: 1rem 2rem; max-width: 56rem; margin: 0 auto; }
.page-header { padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: #1F2937; }
.page-description { color: #6B7280; margin-top: 0.25rem; }
.setting-group { display: flex; flex-direction: column; }
.setting-item { display: grid; grid-template-columns: 12rem 1fr; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid #E5E7EB; }
.setting-item:last-child { border-bottom: none; }
.setting-label { font-size: 0.875rem; font-weight: 500; color: #374151; padding-top: 0.5rem; }
.setting-control { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-input { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; outline: none; transition: all 0.2s; }
.setting-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
.setting-description { color: #6B7280; font-size: 0.875rem; }
.setting-checkbox { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; border: 1px solid #D1D5DB; color: #2563EB; }
</style>