// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Chart.js ecosystem imports
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
// Vue reactivity utilities
import { computed } from 'vue'
// Vue bindings for Chart.js components
import { Bar, Doughnut, Line, Radar } from 'vue-chartjs'

// Global Chart.js registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Base chart prop contract
interface Props {
  type: 'bar' | 'line' | 'doughnut' | 'radar'
  data: ChartData
  options?: ChartOptions
  title?: string
  height?: number
  heightClass?: string
  showCard?: boolean
}

// Default prop values
const props = withDefaults(defineProps<Props>(), {
  height: 320,
  heightClass: '',
  showCard: true,
})

// Wrapper styling depending on card mode
const wrapperClass = computed(() =>
  props.showCard
    ? 'rounded-xl border border-gray-100 bg-white p-6 shadow-sm'
    : 'w-full',
)

// Custom class and style helpers
const chartContainerClass = computed(() => props.heightClass || '')

const chartContainerStyle = computed(() =>
  props.heightClass ? undefined : ({ height: `${props.height}px` } as Record<string, string>),
)
</script>

<template>
  <div :class="wrapperClass">
    <h3 v-if="props.title" class="mb-4 text-base font-semibold text-gray-700">
      {{ props.title }}
    </h3>

    <div class="relative w-full" :class="chartContainerClass" :style="chartContainerStyle">
      <Bar
        v-if="props.type === 'bar'"
        :data="(props.data as unknown as ChartData<'bar'>)"
        :options="(props.options as unknown as ChartOptions<'bar'>)"
        :height="props.height"
      />
      <Line
        v-else-if="props.type === 'line'"
        :data="(props.data as unknown as ChartData<'line'>)"
        :options="(props.options as unknown as ChartOptions<'line'>)"
        :height="props.height"
      />
      <Doughnut
        v-else-if="props.type === 'doughnut'"
        :data="(props.data as unknown as ChartData<'doughnut'>)"
        :options="(props.options as unknown as ChartOptions<'doughnut'>)"
        :height="props.height"
      />
      <Radar
        v-else-if="props.type === 'radar'"
        :data="(props.data as unknown as ChartData<'radar'>)"
        :options="(props.options as unknown as ChartOptions<'radar'>)"
        :height="props.height"
      />
    </div>
  </div>
</template>