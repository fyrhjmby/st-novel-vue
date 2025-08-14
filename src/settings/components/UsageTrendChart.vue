<template>
  <div
      ref="chartContainer"
      class="relative h-64 bg-[var(--color-bg-muted)] rounded-lg p-4 group"
      @mousemove="handleMouseMove"
      @mouseleave="hideTooltip"
  >
    <svg v-if="data.length > 0 && width > 0" :viewBox="`0 0 ${width} ${height}`" class="w-full h-full overflow-visible">
      <defs>
        <linearGradient :id="gradientIdRequests" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-text-accent)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--color-text-accent)" stop-opacity="0"/>
        </linearGradient>
        <linearGradient :id="gradientIdTokens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-accent-purple)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--color-accent-purple)" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Y-axis grid lines -->
      <g class="text-[var(--color-border-primary)]" stroke-dasharray="2,2">
        <line v-for="y in yAxisLines" :key="y" :x1="padding.left" :y1="y" :x2="width - padding.right" :y2="y" stroke="currentColor"/>
      </g>

      <!-- Area Fills -->
      <path :d="areaPathRequests" :fill="`url(#${gradientIdRequests})`" />
      <path :d="areaPathTokens" :fill="`url(#${gradientIdTokens})`" />

      <!-- Lines -->
      <path :d="linePathRequests" fill="none" stroke="var(--color-text-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path :d="linePathTokens" fill="none" stroke="var(--color-accent-purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Interactive Elements -->
      <g v-if="tooltip.visible">
        <line :x1="tooltip.x" :y1="padding.top" :x2="tooltip.x" :y2="height - padding.bottom" stroke-width="1" class="text-[var(--color-text-muted)]" />
        <circle :cx="tooltip.x" :cy="tooltip.reqY" r="5" fill="var(--color-text-accent)" stroke="var(--color-bg-primary)" stroke-width="2" />
        <circle :cx="tooltip.x" :cy="tooltip.tokY" r="5" fill="var(--color-accent-purple)" stroke="var(--color-bg-primary)" stroke-width="2" />
      </g>

      <!-- X-axis labels -->
      <g class="fill-current text-[var(--color-text-muted)] text-[10px]" text-anchor="middle">
        <text v-for="point in points" :key="point.label" :x="point.x" :y="height - padding.bottom + 15">{{ point.label }}</text>
      </g>

      <!-- Y-axis labels -->
      <g class="fill-current text-[var(--color-text-muted)] text-[10px]" text-anchor="end">
        <text v-for="label in yAxisLabels" :key="label.value" :x="padding.left - 8" :y="label.y">{{ label.text }}</text>
      </g>
    </svg>

    <div v-if="tooltip.visible" class="chart-tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      <div class="font-bold mb-1 text-[var(--color-text-primary)]">{{ tooltip.label }}</div>
      <div class="flex items-center gap-2 text-xs"><div class="w-2 h-2 rounded-full bg-[var(--color-text-accent)]"></div>请求数: {{ tooltip.requests.toLocaleString() }}</div>
      <div class="flex items-center gap-2 text-xs"><div class="w-2 h-2 rounded-full bg-[var(--color-accent-purple)]"></div>Tokens: {{ tooltip.tokens.toLocaleString() }}k</div>
    </div>

    <div v-if="data.length === 0" class="flex items-center justify-center h-full">
      <p class="text-[var(--color-text-muted)]">无可用图表数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, onMounted, onUnmounted } from 'vue';
import type { ChartDataPoint } from '@/types/usageLogs';

const props = defineProps({
  data: {
    type: Array as PropType<ChartDataPoint[]>,
    required: true,
  },
});

const chartContainer = ref<HTMLElement | null>(null);
const width = ref(0);
const height = ref(0);

const padding = { top: 10, right: 10, bottom: 30, left: 40 };
const gradientIdRequests = 'gradient-req';
const gradientIdTokens = 'gradient-tok';

const chartAreaWidth = computed(() => width.value - padding.left - padding.right);
const chartAreaHeight = computed(() => height.value - padding.top - padding.bottom);

onMounted(() => {
  const observer = new ResizeObserver(entries => {
    if (entries[0]) {
      const rect = entries[0].contentRect;
      width.value = rect.width;
      height.value = rect.height;
    }
  });
  if (chartContainer.value) {
    observer.observe(chartContainer.value);
  }
  onUnmounted(() => {
    if (chartContainer.value) {
      observer.unobserve(chartContainer.value);
    }
  });
});

const getNiceMaxValue = (value: number): number => {
  if (value <= 0) return 10;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / power;
  if (scaled <= 1) return 1 * power;
  if (scaled <= 2) return 2 * power;
  if (scaled <= 5) return 5 * power;
  return 10 * power;
};

const maxRequestValue = computed(() => getNiceMaxValue(Math.max(0, ...props.data.map(d => d.requests))));
const maxTokenValue = computed(() => getNiceMaxValue(Math.max(0, ...props.data.map(d => d.tokens))));

const yAxisLines = computed(() => Array.from({ length: 5 }, (_, i) => padding.top + i * chartAreaHeight.value / 4));
const yAxisLabels = computed(() => yAxisLines.value.map((y, i) => {
  const value = maxRequestValue.value * (1 - i / 4);
  return { y: y + 3, value: value, text: value >= 1000 ? `${(value/1000).toFixed(0)}k` : Math.round(value).toString() };
}));

const points = computed(() => {
  if (props.data.length === 0 || chartAreaWidth.value <= 0) return [];
  return props.data.map((d, i) => {
    const x = padding.left + (props.data.length > 1 ? (i / (props.data.length - 1)) * chartAreaWidth.value : chartAreaWidth.value / 2);
    const reqY = padding.top + (1 - d.requests / maxRequestValue.value) * chartAreaHeight.value;
    const tokY = padding.top + (1 - d.tokens / maxTokenValue.value) * chartAreaHeight.value;
    return { x, reqY, tokY, label: d.label };
  });
});

const createPath = (dataPoints: {x:number, y:number}[]) => {
  if (dataPoints.length === 0) return '';
  return dataPoints.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ');
}

const linePathRequests = computed(() => createPath(points.value.map(p => ({x: p.x, y: p.reqY}))));
const linePathTokens = computed(() => createPath(points.value.map(p => ({x: p.x, y: p.tokY}))));

const createAreaPath = (linePath: string) => {
  if (!linePath) return '';
  const lastPointX = points.value.length > 0 ? points.value[points.value.length - 1].x : width.value - padding.right;
  const firstPointX = points.value.length > 0 ? points.value[0].x : padding.left;
  return `${linePath} V ${height.value - padding.bottom} H ${firstPointX} Z`;
}

const areaPathRequests = computed(() => createAreaPath(linePathRequests.value));
const areaPathTokens = computed(() => createAreaPath(linePathTokens.value));

const tooltip = ref({
  visible: false, x: 0, y: 0, reqY: 0, tokY: 0,
  label: '', requests: 0, tokens: 0,
});

const handleMouseMove = (event: MouseEvent) => {
  if (props.data.length === 0 || points.value.length === 0) return;
  const svgRect = (event.currentTarget as HTMLElement).querySelector('svg')?.getBoundingClientRect();
  if (!svgRect) return;

  const svgX = (event.clientX - svgRect.left);

  let minDistance = Infinity;
  let closestIndex = 0;

  points.value.forEach((point, index) => {
    const screenX = (point.x / width.value) * svgRect.width;
    const distance = Math.abs(screenX - svgX);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  const activePoint = points.value[closestIndex];
  const activeData = props.data[closestIndex];

  const tooltipX = (activePoint.x / width.value) * svgRect.width + svgRect.left;
  const tooltipY = Math.min(activePoint.reqY, activePoint.tokY) / height.value * svgRect.height + svgRect.top;

  tooltip.value = {
    visible: true,
    x: (tooltipX - svgRect.left),
    y: (tooltipY - svgRect.top - 10),
    reqY: activePoint.reqY,
    tokY: activePoint.tokY,
    label: activeData.label,
    requests: activeData.requests,
    tokens: activeData.tokens
  };
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};
</script>

<style scoped>
.chart-tooltip {
  position: absolute;
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  transition: opacity 0.2s, top 0.1s, left 0.1s;
  z-index: 10;
  box-shadow: var(--shadow-md);
}
</style>