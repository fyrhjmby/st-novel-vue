<template>
  <div class="notification-center">
    <transition-group name="notification-fade" tag="div">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification-toast', `notification-${notification.type}`]"
          @click="notificationStore.remove(notification.id)"
      >
        <span class="message">{{ notification.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '@/core/stores/notificationStore';

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);
</script>

<style scoped>
.notification-center {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  pointer-events: all; /* Re-enable pointer events for toasts */
}
.notification-toast {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  cursor: pointer;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}
.notification-info { background-color: #3B82F6; }
.notification-success { background-color: #16A34A; }
.notification-warning { background-color: #F59E0B; }
.notification-error { background-color: #DC2626; }

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>