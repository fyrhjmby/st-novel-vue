<!-- 文件: src/core/components/ErrorDisplay.vue -->
<template>
  <div class="error-display-container">
    <i class="fa-solid fa-circle-exclamation error-icon"></i>
    <h3 class="error-title">Failed to Load Content</h3>
    <p class="error-message">{{ message }}</p>
    <p class="error-suggestion">
      You can try to <a href="#" @click.prevent="reload">reload</a> the item or close this tab.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['reload']);

const reload = () => {
  emit('reload');
};
</script>

<style scoped>
.error-display-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  user-select: none;
  background-color: #FFFFFF;
}
.error-icon {
  font-size: 3rem;
  color: #F87171;
}
.error-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #4B5563;
  margin-top: 1.5rem;
}
.error-message {
  color: #6B7280;
  margin-top: 0.5rem;
  max-width: 500px;
}
.error-suggestion {
  color: #9CA3AF;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}
.error-suggestion a {
  color: #3B82F6;
  text-decoration: none;
}
.error-suggestion a:hover {
  text-decoration: underline;
}
</style>