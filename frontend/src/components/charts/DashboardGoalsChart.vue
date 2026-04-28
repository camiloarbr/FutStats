// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import type { ChartData, ChartOptions } from 'chart.js'
import { computed } from 'vue'

// 2. Internal imports
import BarChart from '@/components/charts/BarChart.vue'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface Props {
  teams: TeamInterface[]
}

const props = defineProps<Props>()

const teamsByGoals = computed<TeamInterface[]>(() =>
  [...props.teams]
    .sort((firstTeam, secondTeam) => secondTeam.goalsFor - firstTeam.goalsFor)
    .slice(0, 6)
)

const chartData = computed(
  (): ChartData<'bar'> => ({
    labels: teamsByGoals.value.map((team) => team.name),
    datasets: [
      {
        label: 'Goals',
        data: teamsByGoals.value.map((team) => team.goalsFor),
        backgroundColor: ['#1b69ff', '#3d82ff', '#5b96ff', '#7baeff', '#9ac4ff', '#bfdcff'],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 22,
      },
    ],
  })
)

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0d1525',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: '#e5e7eb' },
      ticks: { precision: 0, color: '#64748b', font: { size: 12, weight: 600 } },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 12, weight: 600 } },
    },
  },
}
</script>

<template>
  <BarChart :data="chartData" :options="chartOptions" :height="420" :show-card="false" />
</template>
