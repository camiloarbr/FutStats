// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
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

const chartContainerStyle = computed<CSSProperties | undefined>(() =>
  props.heightClass ? undefined : { height: `${props.height}px` },
)
</script>

<template>
  <div :class="wrapperClass">
    <h3 v-if="props.title" class="mb-4 text-base font-semibold text-gray-700">
      {{ props.title }}
    </h3>

    <div class="relative w-full" :class="chartContainerClass" :style="chartContainerStyle">
      <Bar
        :data="props.data"
        :options="props.options"
        :height="props.height"
      />
    </div>
  </div>
</template>