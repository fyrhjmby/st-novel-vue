<template>
  <div class="min-h-screen bg-[#F5F5F7]">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <button @click="router.back()" class="text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <h1 class="text-lg font-medium text-gray-900">会员计划</h1>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">当前计划: Pro</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-light text-gray-900 mb-4">选择适合您的计划</h1>
        <p class="text-lg text-gray-600 mb-8">无论您是个人用户还是团队，我们都有适合的方案</p>

        <div class="price-toggle">
          <div class="price-toggle-slider" :class="{ yearly: pricingType === 'yearly' }"></div>
          <button :class="{ active: pricingType === 'monthly' }" @click="togglePricing('monthly')">按月付费</button>
          <button :class="{ active: pricingType === 'yearly' }" @click="togglePricing('yearly')">按年付费</button>
        </div>
        <p class="text-sm text-green-600 mt-2">年付享8折优惠</p>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">
          <div v-for="plan in plans" :key="plan.name" class="plan-card" :class="{ featured: plan.featured }">
            <div class="mb-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ plan.name }}</h3>
              <p class="text-gray-600 text-sm mb-6">{{ plan.description }}</p>
              <div class="mb-6">
                <span class="text-4xl font-light text-gray-900">¥{{ pricingType === 'monthly' ? plan.price.monthly : plan.price.yearly }}</span>
                <span class="text-gray-500">/月</span>
              </div>
              <button class="w-full py-3 px-6 rounded-lg font-medium transition-colors" :class="plan.buttonClass">
                {{ plan.buttonText }}
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="feature in plan.features" :key="feature.text" class="feature-item">
                <div class="check-icon" :class="feature.included ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'">
                  <svg v-if="feature.included" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </div>
                <span class="text-sm" :class="feature.included ? 'text-gray-700' : 'text-gray-400'">{{ feature.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-16">
          <h2 class="text-2xl font-semibold text-gray-900 text-center mb-8">功能对比</h2>
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th class="text-left py-4 px-6 text-sm font-medium text-gray-700 whitespace-nowrap">功能</th>
                  <th v-for="plan in plans" :key="plan.name" class="text-center py-4 px-6 text-sm font-medium text-gray-700 whitespace-nowrap">{{ plan.name }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in comparisonTable" :key="row.feature" class="border-b border-gray-100 last:border-b-0">
                  <td class="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">{{ row.feature }}</td>
                  <td v-for="value in row.values" :key="value" class="text-center py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    <template v-if="typeof value === 'boolean'">
                      <svg v-if="value" class="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      <svg v-else class="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </template>
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="mb-16">
          <h2 class="text-2xl font-semibold text-gray-900 text-center mb-8">常见问题</h2>
          <div class="max-w-3xl mx-auto space-y-4">
            <div v-for="(item, index) in faq" :key="index" class="faq-item">
              <button @click="toggleFAQ(index)" class="w-full p-6 text-left flex items-center justify-between">
                <span class="text-gray-900 font-medium">{{ item.question }}</span>
                <svg class="w-5 h-5 text-gray-500 transform transition-transform" :class="{'rotate-180': item.open}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div v-show="item.open" class="px-6 pb-6">
                <p class="text-gray-600">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="gradient-bg py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p class="text-gray-600 text-sm">如有其他问题，请联系 support@example.com</p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pricingType = ref('monthly');

const plans = ref([
  { name: 'Free', description: '适合个人轻度使用', price: { monthly: 0, yearly: 0 }, buttonText: '当前计划', buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50', featured: false, features: [
      { text: '每月 1万 tokens', included: true },
      { text: 'GPT-3.5 访问权限', included: true },
      { text: '基础功能', included: true },
      { text: 'API 访问', included: false },
      { text: '优先支持', included: false },
    ]},
  { name: 'Pro', description: '适合专业用户和创作者', price: { monthly: 99, yearly: 79 }, buttonText: '升级到 Pro', buttonClass: 'bg-[#4B5563] text-white hover:bg-[#374151]', featured: true, features: [
      { text: '每月 50万 tokens', included: true },
      { text: 'GPT-4 & Claude 3 访问权限', included: true },
      { text: '高级功能 & 插件', included: true },
      { text: 'API 访问 (5,000次/月)', included: true },
      { text: '优先响应 & 技术支持', included: true },
    ]},
  { name: 'Max', description: '适合重度用户和团队', price: { monthly: 299, yearly: 239 }, buttonText: '升级到 Max', buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50', featured: false, features: [
      { text: '无限 tokens', included: true },
      { text: '所有模型访问权限', included: true },
      { text: '专属功能 & 抢先体验', included: true },
      { text: 'API 访问 (无限制)', included: true },
      { text: '专属客户经理', included: true },
    ]},
]);

const comparisonTable = ref([
  { feature: '每月 Tokens 额度', values: ['1万', '50万', '无限'] },
  { feature: 'GPT-3.5 访问', values: [true, true, true] },
  { feature: 'GPT-4 访问', values: [false, true, true] },
  { feature: 'Claude 3 访问', values: [false, true, true] },
  { feature: '响应速度', values: ['标准', '快速', '最快'] },
  { feature: 'API 调用次数', values: ['-', '5,000/月', '无限制'] },
  { feature: '技术支持', values: ['社区', '优先邮件', '专属经理'] },
]);

const faq = reactive([
  { question: '如何升级或降级我的计划？', answer: '您可以随时在设置页面中升级或降级您的计划。升级会立即生效，降级将在下个计费周期开始时生效。', open: false },
  { question: 'Token 是什么？如何计算？', answer: 'Token 是 AI 模型处理文本的基本单位。通常 1 个 token 约等于 4 个字符或 0.75 个英文单词。中文通常每个字算 2-3 个 tokens。', open: false },
  { question: '可以退款吗？', answer: '我们提供 7 天无理由退款保证。如果您对服务不满意，可以在购买后 7 天内申请全额退款。', open: false },
]);

function togglePricing(type: 'monthly' | 'yearly') {
  pricingType.value = type;
}

function toggleFAQ(index: number) {
  faq[index].open = !faq[index].open;
}
</script>

<style scoped>
.plan-card { background: white; border-radius: 16px; border: 1px solid #E5E7EB; padding: 32px; position: relative; transition: all 0.3s ease; }
.plan-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); border-color: #D1D5DB; }
.plan-card.featured { border: 2px solid #4B5563; transform: scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.plan-card.featured:hover { transform: scale(1.02) translateY(-2px); }
.plan-card.featured::before { content: '最受欢迎'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #4B5563; color: white; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 500; }

.price-toggle { display: inline-flex; background: #F3F4F6; padding: 4px; border-radius: 10px; position: relative; }
.price-toggle button { padding: 8px 20px; border: none; background: transparent; border-radius: 8px; font-size: 14px; font-weight: 500; color: #6B7280; transition: all 0.2s; position: relative; z-index: 2; cursor: pointer;}
.price-toggle button.active { color: #374151; }

.price-toggle-slider { position: absolute; top: 4px; left: 4px; width: calc(50% - 4px); height: calc(100% - 8px); background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; z-index: 1; }
.price-toggle-slider.yearly { transform: translateX(100%); }

.feature-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; }
.check-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.faq-item { background: white; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; transition: all 0.2s; }
.faq-item:hover { border-color: #D1D5DB; }
.gradient-bg { background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); }
</style>