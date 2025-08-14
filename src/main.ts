import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.css'

import App from './App.vue'
import router from './router'
import { useAuthService } from './auth/services/auth.service'

const app = createApp(App)

app.use(createPinia())

// 应用初始化函数
async function initializeApp() {
    const { initializeAuth } = useAuthService();

    // 在挂载应用前，先完成认证状态的初始化
    await initializeAuth();

    // 认证状态确定后再使用路由和挂载应用
    app.use(router)
    app.mount('#app')
}

// 禁止页面缩放
function disableZoom() {
    // 阻止通过鼠标滚轮缩放
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // 阻止通过键盘快捷键缩放
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '+' || e.key === '0')) {
            e.preventDefault();
        }
    });
}

disableZoom();
initializeApp();