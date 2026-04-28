// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { computed } from 'vue'

// 2. Internal imports
import BarChart from '@/components/charts/BarChart.vue'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import { Formatters } from '@/utils/Formatters'

interface Props {
  player: PlayerInterface
}

const props = defineProps<Props>()

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: ['Goals', 'Assists', 'Shots', 'Passes'],
  datasets: [
    {
      label: props.player.fullName,
      data: [props.player.goals, props.player.assists, props.player.shots, props.player.passes],
      backgroundColor: ['#2563eb', '#22d3ee', '#0ea5e9', '#38bdf8'],
      borderRadius: 12,
      borderSkipped: false,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'bar'>): string {
          const value = context.parsed.y ?? 0
          return Formatters.formatChartTooltip(value, context.label.toLowerCase())
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}
</script>

<template>
  <BarChart :data="chartData" :options="chartOptions" :height="320" title="Attacking Output" />
</template>
