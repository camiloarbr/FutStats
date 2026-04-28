// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import BarChart from '@/components/charts/BarChart.vue'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import { Formatters } from '@/utils/Formatters'

interface Props {
  players: PlayerInterface[]
}

const props = defineProps<Props>()

const chartPlayers = computed<PlayerInterface[]>(() =>
  [...props.players]
    .sort((firstPlayer, secondPlayer) => secondPlayer.goals - firstPlayer.goals)
    .slice(0, 10)
)

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: chartPlayers.value.map((player) => player.fullName),
  datasets: [
    {
      label: 'Goals',
      data: chartPlayers.value.map((player) => player.goals),
      backgroundColor: '#2563eb',
      borderRadius: 10,
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
          const goals = context.parsed.y ?? 0
          return Formatters.formatChartTooltip(goals, 'goals')
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      title: { display: true, text: 'Goals' },
    },
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 40,
        minRotation: 0,
      },
    },
  },
}
</script>

<template>
  <BarChart :data="chartData" :options="chartOptions" :height="280" title="Top Scorers (Goals)" />
</template>
