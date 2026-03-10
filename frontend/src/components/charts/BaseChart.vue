// @author: [Name] | FutStats
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
}
const props = withDefaults(defineProps<Props>(), {
  height: 320,
})

const containerStyles = computed(() => ({
  height: `${props.height}px`,
}))
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    :style="containerStyles"
  >
    <!-- optional title -->
    <h3 v-if="props.title" class="text-base font-semibold text-gray-700 mb-4">
      {{ props.title }}
    </h3>

    <!-- dynamic chart type -->
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
</template>
