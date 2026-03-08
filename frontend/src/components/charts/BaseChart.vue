// @author: [Name] | FutStats
<script setup lang="ts">
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
}

const props = defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <!-- optional title -->
    <h3 v-if="props.title" class="text-base font-semibold text-gray-700 mb-4">
      {{ props.title }}
    </h3>

    <!-- dynamic chart type -->
    <Bar
      v-if="props.type === 'bar'"
      :data="(props.data as unknown as ChartData<'bar'>)"
      :options="(props.options as unknown as ChartOptions<'bar'>)"
    />
    <Line
      v-else-if="props.type === 'line'"
      :data="(props.data as unknown as ChartData<'line'>)"
      :options="(props.options as unknown as ChartOptions<'line'>)"
    />
    <Doughnut
      v-else-if="props.type === 'doughnut'"
      :data="(props.data as unknown as ChartData<'doughnut'>)"
      :options="(props.options as unknown as ChartOptions<'doughnut'>)"
    />
    <Radar
      v-else-if="props.type === 'radar'"
      :data="(props.data as unknown as ChartData<'radar'>)"
      :options="(props.options as unknown as ChartOptions<'radar'>)"
    />
  </div>
</template>
