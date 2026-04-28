// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
import { computed } from 'vue'

// 2. Internal imports
import LineChart from '@/components/charts/LineChart.vue'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import { Formatters } from '@/utils/Formatters'

interface Props {
  matches: MatchInterface[]
}

const props = defineProps<Props>()

const chronologicMatches = computed<MatchInterface[]>(() =>
  [...props.matches].sort((firstMatch, secondMatch) => {
    const firstDate = firstMatch.date instanceof Date ? firstMatch.date : new Date(firstMatch.date)
    const secondDate =
      secondMatch.date instanceof Date ? secondMatch.date : new Date(secondMatch.date)
    return firstDate.getTime() - secondDate.getTime()
  })
)

const chartData = computed<ChartData<'line'>>(() => ({
  labels: chronologicMatches.value.map((match) => Formatters.formatMatchDate(match.date)),
  datasets: [
    {
      label: 'Goals per Match',
      data: chronologicMatches.value.map((match) => match.homeScore + match.awayScore),
      borderColor: '#2563eb',
      pointBackgroundColor: '#1d4ed8',
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      fill: true,
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 4,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'line'>): string {
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
      title: { display: true, text: 'Total Goals' },
    },
    x: {
      title: { display: true, text: 'Match Date' },
    },
  },
}
</script>

<template>
  <LineChart
    class="rounded-2xl border border-blue-50 bg-white p-4 shadow-xl shadow-blue-500/10"
    :height="240"
    :data="chartData"
    :options="chartOptions"
    title="Goals per Match"
  />
</template>
