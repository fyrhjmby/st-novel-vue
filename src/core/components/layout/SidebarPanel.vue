
<template>
  <div class="sidebar-panel-container">
    <div class="header">
      <!-- The title can be passed down via a slot or a prop -->
      <slot name="header">
        <h3 class="title">Sidebar</h3>
      </slot>
    </div>
    <div class="content">
      <slot>
        <!-- Default content if no content is provided by the app -->
        <div class="p-4 text-sm text-gray-500">
          This is the default sidebar content.
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.sidebar-panel-container {
  width: 100%;
  background-color: #FAFBFC;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.header {
  padding: 0 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #F0F0F0;
  flex-shrink: 0;
}
.title {
  font-size: 1rem;
  font-weight: 500;
  color: #1F2937;
}
.content {
  flex-grow: 1;
  position: relative;
  overflow: auto;
}
</style>