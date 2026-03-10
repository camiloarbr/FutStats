// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
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
} from 'chart.js'
import { Bar, Line, Doughnut, Radar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

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

interface Props {
  type: 'bar' | 'line' | 'doughnut' | 'radar'
  data: ChartData
  options?: ChartOptions
  title?: string
  height?: number
  heightClass?: string
  showCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
  heightClass: '',
  showCard: true,
})

const wrapperClass = computed(() =>
  props.showCard
    ? 'rounded-xl border border-gray-100 bg-white p-6 shadow-sm'
    : 'w-full',
)

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