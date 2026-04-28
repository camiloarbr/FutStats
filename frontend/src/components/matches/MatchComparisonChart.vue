// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// 2. Internal imports
import BarChart from '@/components/charts/BarChart.vue'
import type { MatchInterface } from '@/interfaces/MatchInterface'

interface Props {
  match: MatchInterface
  homeTeamName: string
  awayTeamName: string
}

const props = defineProps<Props>()

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: ['Possession %', 'Shots', 'Fouls'],
  datasets: [
    {
      label: props.homeTeamName,
      data: [props.match.possessionHome, props.match.shotsHome, props.match.foulsHome],
      backgroundColor: '#1d4ed8',
      borderRadius: 10,
      barThickness: 32,
    },
    {
      label: props.awayTeamName,
      data: [props.match.possessionAway, props.match.shotsAway, props.match.foulsAway],
      backgroundColor: '#38bdf8',
      borderRadius: 10,
      barThickness: 32,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#0f172a',
        font: { family: '"Space Grotesk", "Inter", sans-serif' },
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148, 163, 184, 0.3)', drawTicks: false },
      ticks: { color: '#475569', precision: 0 },
    },
  },
}
</script>

<template>
  <BarChart :height="320" :data="chartData" :options="chartOptions" title="Home vs Away Metrics" />
</template>
