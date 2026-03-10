<!-- @author: Samuel | FutStats -->
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
  heightClass?: string
  showCard?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  height: 320,
})

const props = withDefaults(defineProps<Props>(), {
  heightClass: 'h-[320px]',
  showCard: false,
})
</script>

<template>
  <div
    :class="
      props.showCard
        ? 'rounded-xl border border-gray-100 bg-white p-6 shadow-sm'
        : 'w-full'
    "
  >
    <h3 v-if="props.title" class="mb-4 text-base font-semibold text-gray-700">
      {{ props.title }}
    </h3>

    <div class="relative w-full" :class="props.heightClass">
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
  </div>
</template>