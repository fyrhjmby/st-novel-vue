<!-- 文件: src/core/components/WelcomeScreen.vue -->
<!-- 描述: 空窗格的欢迎界面，提供更友好的用户体验。 -->
<template>
  <div class="welcome-screen">
    <i class="fa-solid fa-feather-pointed welcome-icon"></i>
    <h1 class="welcome-title">Editor Core</h1>
    <p class="welcome-subtitle">Select a file from the sidebar to begin.</p>
  </div>
</template>

<style scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
  background-color: #FFFFFF;
}
.welcome-icon {
  font-size: 4rem; /* 64px */
  color: #E5E7EB; /* gray-200 */
}
.welcome-title {
  font-size: 1.5rem; /* 24px */
  font-weight: 500;
  color: #4B5563; /* gray-600 */
  margin-top: 1.5rem;
}
.welcome-subtitle {
  color: #9CA3AF; /* gray-400 */
  margin-top: 0.5rem;
}
</style>