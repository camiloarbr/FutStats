// @author: Samuel | FutStats
<script setup lang="ts">
// 1. External imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// 2. Internal imports
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface Props {
  team: TeamInterface
}

const props = defineProps<Props>()

const chartData = computed(
  (): ChartData<'doughnut'> => ({
    labels: ['Wins', 'Draws', 'Losses'],
    datasets: [
      {
        data: [props.team.wins, props.team.draws, props.team.losses],
        backgroundColor: ['#1b69ff', '#94a3b8', '#0d1525'],
        borderWidth: 0,
      },
    ],
  })
)

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#475569',
        font: { size: 12, weight: 600 },
        usePointStyle: true,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#0d1525',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: true,
    },
  },
  cutout: '68%',
}
</script>

<template>
  <DoughnutChart :data="chartData" :options="chartOptions" heightClass="h-[320px]" />
</template>
