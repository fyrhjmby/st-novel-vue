<template>
  <div
      class="relative h-64 bg-gray-50 rounded-lg p-4"
      @mousemove="handleMouseMove"
      @mouseleave="hideTooltip"
  >
    <svg v-if="data.length > 0" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="w-full h-full overflow-visible">
      <defs>
        <linearGradient :id="gradientIdRequests" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="barColors.requests" stop-opacity="0.3"/>
          <stop offset="100%" :stop-color="barColors.requests" stop-opacity="0"/>
        </linearGradient>
        <linearGradient :id="gradientIdTokens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="barColors.tokens" stop-opacity="0.3"/>
          <stop offset="100%" :stop-color="barColors.tokens" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Y-axis grid lines -->
      <g class="text-gray-200" stroke-dasharray="2,2">
        <line v-for="y in yAxisLines" :key="y" :x1="padding.left" :y1="y" :x2="svgWidth - padding.right" :y2="y" stroke="currentColor"/>
      </g>

      <!-- Area Fills -->
      <path :d="areaPathRequests" :fill="`url(#${gradientIdRequests})`" />
      <path :d="areaPathTokens" :fill="`url(#${gradientIdTokens})`" />

      <!-- Lines -->
      <path :d="linePathRequests" fill="none" :stroke="barColors.requests" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path :d="linePathTokens" fill="none" :stroke="barColors.tokens" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data Points -->
      <g>
        <circle v-for="point in points" :key="'req-'+point.label" :cx="point.x" :cy="point.reqY" r="4" :fill="barColors.requests" class="opacity-0 group-hover:opacity-100 transition-opacity" />
        <circle v-for="point in points" :key="'tok-'+point.label" :cx="point.x" :cy="point.tokY" r="4" :fill="barColors.tokens" class="opacity-0 group-hover:opacity-100 transition-opacity" />
      </g>

      <!-- X-axis labels -->
      <g class="text-gray-500 text-[10px]" text-anchor="middle">
        <text v-for="point in points" :key="point.label" :x="point.x" :y="svgHeight - padding.bottom + 15">{{ point.label }}</text>
      </g>

      <!-- Y-axis labels -->
      <g class="text-gray-500 text-[10px]" text-anchor="end">
        <text v-for="label in yAxisLabels" :key="label.value" :x="padding.left - 5" :y="label.y">{{ label.text }}</text>
      </g>

      <!-- Interactive Elements -->
      <g v-if="tooltip.visible">
        <line :x1="tooltip.x" :y1="padding.top" :x2="tooltip.x" :y2="svgHeight - padding.bottom" stroke-width="1" class="text-gray-400" />
        <circle :cx="tooltip.x" :cy="tooltip.reqY" r="5" :fill="barColors.requests" stroke="white" stroke-width="2" />
        <circle :cx="tooltip.x" :cy="tooltip.tokY" r="5" :fill="barColors.tokens" stroke="white" stroke-width="2" />
      </g>
    </svg>

    <div v-if="tooltip.visible" class="chart-tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      <div class="font-bold mb-1">{{ tooltip.label }}</div>
      <div class="flex items-center gap-2 text-xs"><div class="w-2 h-2 rounded-full bg-blue-500"></div>请求数: {{ tooltip.requests.toLocaleString() }}</div>
      <div class="flex items-center gap-2 text-xs"><div class="w-2 h-2 rounded-full bg-purple-500"></div>Tokens: {{ tooltip.tokens.toLocaleString() }}k</div>
    </div>

    <div v-if="data.length === 0" class="flex items-center justify-center h-full">
      <p class="text-gray-400">无可用图表数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import type { ChartDataPoint } from '@/settings/api/usageLogsApi';

const props = defineProps({
  data: {
    type: Array as PropType<ChartDataPoint[]>,
    required: true,
  },
});

const svgWidth = 500;
const svgHeight = 200;
const padding = { top: 10, right: 10, bottom: 30, left: 35 };
const barColors = { requests: '#3B82F6', tokens: '#8B5CF6' };
const gradientIdRequests = 'gradient-req';
const gradientIdTokens = 'gradient-tok';
const activeIndex = ref<number | null>(null);

const chartAreaWidth = svgWidth - padding.left - padding.right;
const chartAreaHeight = svgHeight - padding.top - padding.bottom;

const maxRequestValue = computed(() => Math.max(1, ...props.data.map(d => d.requests)));
const maxTokenValue = computed(() => Math.max(1, ...props.data.map(d => d.tokens)));

const yAxisLines = computed(() => Array.from({ length: 5 }, (_, i) => padding.top + i * chartAreaHeight / 4));
const yAxisLabels = computed(() => yAxisLines.value.map((y, i) => {
  const value = maxRequestValue.value * (1 - i / 4);
  return { y: y + 3, text: value >= 1000 ? `${(value/1000).toFixed(1)}k` : Math.round(value).toString() };
}));

const points = computed(() => {
  return props.data.map((d, i) => {
    const x = padding.left + (i / (props.data.length - 1 || 1)) * chartAreaWidth;
    const reqY = padding.top + (1 - d.requests / maxRequestValue.value) * chartAreaHeight;
    const tokY = padding.top + (1 - d.tokens / maxTokenValue.value) * chartAreaHeight;
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
  return `${linePath} L ${svgWidth-padding.right},${svgHeight-padding.bottom} L ${padding.left},${svgHeight-padding.bottom} Z`;
}

const areaPathRequests = computed(() => createAreaPath(linePathRequests.value));
const areaPathTokens = computed(() => createAreaPath(linePathTokens.value));

const tooltip = ref({
  visible: false,
  x: 0, y: 0,
  reqY: 0, tokY: 0,
  label: '',
  requests: 0, tokens: 0,
});

const handleMouseMove = (event: MouseEvent) => {
  if (props.data.length === 0) return;
  const svgRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
  const svgX = (event.clientX - svgRect.left) * (svgWidth / svgRect.width);

  let minDistance = Infinity;
  let closestIndex = 0;

  points.value.forEach((point, index) => {
    const distance = Math.abs(point.x - svgX);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  activeIndex.value = closestIndex;
  const activePoint = points.value[closestIndex];
  const activeData = props.data[closestIndex];

  tooltip.value = {
    visible: true,
    x: activePoint.x,
    y: Math.min(activePoint.reqY, activePoint.tokY) - 5,
    reqY: activePoint.reqY,
    tokY: activePoint.tokY,
    label: activeData.label,
    requests: activeData.requests,
    tokens: activeData.tokens
  };
};

const hideTooltip = () => {
  activeIndex.value = null;
  tooltip.value.visible = false;
};
</script>

<style scoped>
.chart-tooltip {
  position: absolute;
  background-color: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>