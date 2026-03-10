// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ChartData, ChartOptions } from 'chart.js'

import BaseChart from '@/components/charts/BaseChart.vue'
import MatchScoreboardHero from '@/components/matches/MatchScoreboardHero.vue'
import MatchStatsSummaryCard from '@/components/matches/MatchStatsSummaryCard.vue'

import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'

import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface StatComparison {
  id: string
  label: string
  homeValue: number
  awayValue: number
  unit?: string
}

const route = useRoute()
const router = useRouter()

const matchId = computed<number>(() => Number(route.params.id))

const match = computed<MatchInterface | undefined>(() => {
  if (Number.isNaN(matchId.value)) {
    return undefined
  }
  return MatchService.getById(matchId.value)
})

const homeTeam = computed<TeamInterface | undefined>(() =>
  match.value ? TeamService.getById(match.value.homeTeamId) : undefined,
)

const awayTeam = computed<TeamInterface | undefined>(() =>
  match.value ? TeamService.getById(match.value.awayTeamId) : undefined,
)

const matchExists = computed<boolean>(() => Boolean(match.value && homeTeam.value && awayTeam.value))

const matchDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formattedDate = computed<string>(() =>
  match.value ? matchDateFormatter.format(match.value.date instanceof Date ? match.value.date : new Date(match.value.date)) : '',
)

const scoreboard = computed(() => {
  if (!matchExists.value || match.value === undefined || homeTeam.value === undefined || awayTeam.value === undefined) {
    return null
  }

  return {
    home: {
      name: homeTeam.value.name,
      score: match.value.homeScore,
      badge: homeTeam.value.imageUrl,
    },
    away: {
      name: awayTeam.value.name,
      score: match.value.awayScore,
      badge: awayTeam.value.imageUrl,
    },
    stadium: match.value.stadium,
  }
})

const statComparisons = computed<StatComparison[]>(() => {
  if (!match.value) {
    return []
  }

  return [
    {
      id: 'possession',
      label: 'Possession',
      homeValue: match.value.possessionHome,
      awayValue: match.value.possessionAway,
      unit: '%',
    },
    {
      id: 'shots',
      label: 'Shots',
      homeValue: match.value.shotsHome,
      awayValue: match.value.shotsAway,
    },
    {
      id: 'fouls',
      label: 'Fouls',
      homeValue: match.value.foulsHome,
      awayValue: match.value.foulsAway,
    },
  ]
})

const statsChartData = computed<ChartData<'bar'>>(() => {
  if (!match.value || !homeTeam.value || !awayTeam.value) {
    return {
      labels: [],
      datasets: [],
    }
  }

  return {
    labels: ['Possession %', 'Shots', 'Fouls'],
    datasets: [
      {
        label: homeTeam.value.name,
        data: [match.value.possessionHome, match.value.shotsHome, match.value.foulsHome],
        backgroundColor: '#1d4ed8',
        borderRadius: 10,
        barThickness: 32,
      },
      {
        label: awayTeam.value.name,
        data: [match.value.possessionAway, match.value.shotsAway, match.value.foulsAway],
        backgroundColor: '#38bdf8',
        borderRadius: 10,
        barThickness: 32,
      },
    ],
  }
})

const statsChartOptions = computed<ChartOptions<'bar'>>(() => ({
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
      grid: {
        display: false,
      },
      ticks: {
        color: '#0f172a',
        font: {
          family: '"Space Grotesk", "Inter", sans-serif',
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(148, 163, 184, 0.3)',
        drawTicks: false,
      },
      ticks: {
        color: '#475569',
        precision: 0,
      },
    },
  },
}))

const heroHighlights = computed(() => {
  const possession = statComparisons.value.find((stat) => stat.id === 'possession')
  const shots = statComparisons.value.find((stat) => stat.id === 'shots')
  const fouls = statComparisons.value.find((stat) => stat.id === 'fouls')

  const possessionCopy = `${possession?.homeValue ?? 0}% — ${possession?.awayValue ?? 0}%`
  const intensityHome = (shots?.homeValue ?? 0) + (fouls?.homeValue ?? 0)
  const intensityAway = (shots?.awayValue ?? 0) + (fouls?.awayValue ?? 0)
  const intensityCopy = `${intensityHome} : ${intensityAway}`

  return [
    { label: 'Possession', value: possessionCopy, tone: 'emerald' as const },
    { label: 'Intensity', value: intensityCopy, tone: 'sky' as const },
  ]
})

watch(
  match,
  (currentMatch) => {
    if (currentMatch === undefined) {
      router.replace({ name: 'matches.index' })
    }
  },
  { immediate: true },
)

watch(
  [homeTeam, awayTeam],
  ([home, away]) => {
    if (home && away) {
      const resolvedTitle = `${home.name} vs ${away.name}`
      route.meta.title = resolvedTitle
      document.title = `FutStats | ${resolvedTitle}`
    }
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="matchExists && scoreboard" class="space-y-10">
    <MatchScoreboardHero
      :scoreboard="scoreboard"
      :formatted-date="formattedDate"
      :highlights="heroHighlights"
    />

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <BaseChart
          :height="320"
          type="bar"
          :data="statsChartData"
          :options="statsChartOptions"
          title="Home vs Away Metrics"
        />
      </div>
      <MatchStatsSummaryCard :stat-comparisons="statComparisons" />
    </div>
  </section>

  <section v-else class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center text-slate-500">
    Loading match insights...
  </section>
</template>

