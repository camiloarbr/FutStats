// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'
import MatchComparisonChart from '@/components/matches/MatchComparisonChart.vue'
import MatchScoreboardHero from '@/components/matches/MatchScoreboardHero.vue'
import MatchStatsSummaryCard from '@/components/matches/MatchStatsSummaryCard.vue'
import { Formatters } from '@/utils/Formatters'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface StatComparison {
  id: string
  label: string
  homeValue: number
  awayValue: number
  unit?: string
}

interface ComparisonChartInput {
  match: MatchInterface
  homeTeamName: string
  awayTeamName: string
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
  match.value ? TeamService.getById(match.value.homeTeamId) : undefined
)

const awayTeam = computed<TeamInterface | undefined>(() =>
  match.value ? TeamService.getById(match.value.awayTeamId) : undefined
)

const matchExists = computed<boolean>(() =>
  Boolean(match.value && homeTeam.value && awayTeam.value)
)

const formattedDate = computed<string>(() =>
  match.value ? Formatters.formatMatchDate(match.value.date) : ''
)

const scoreboard = computed(() => {
  if (
    !matchExists.value ||
    match.value === undefined ||
    homeTeam.value === undefined ||
    awayTeam.value === undefined
  ) {
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

const heroHighlights = computed(() => {
  const possession = statComparisons.value.find((stat) => stat.id === 'possession')
  const shots = statComparisons.value.find((stat) => stat.id === 'shots')
  const fouls = statComparisons.value.find((stat) => stat.id === 'fouls')

  const possessionCopy = Formatters.formatPossession(
    possession?.homeValue ?? 0,
    possession?.awayValue ?? 0
  )
  const intensityHome = (shots?.homeValue ?? 0) + (fouls?.homeValue ?? 0)
  const intensityAway = (shots?.awayValue ?? 0) + (fouls?.awayValue ?? 0)
  const intensityCopy = Formatters.formatIntensity(intensityHome, intensityAway)

  return [
    { label: 'Possession', value: possessionCopy, tone: 'emerald' as const },
    { label: 'Intensity', value: intensityCopy, tone: 'sky' as const },
  ]
})

const comparisonChartInput = computed<ComparisonChartInput | null>(() => {
  if (match.value === undefined || homeTeam.value === undefined || awayTeam.value === undefined) {
    return null
  }

  return {
    match: match.value,
    homeTeamName: homeTeam.value.name,
    awayTeamName: awayTeam.value.name,
  }
})

watch(
  match,
  (currentMatch) => {
    if (currentMatch === undefined) {
      router.replace({ name: 'matches.index' })
    }
  },
  { immediate: true }
)

watch(
  [homeTeam, awayTeam],
  ([home, away]) => {
    if (home && away) {
      const resolvedTitle = Formatters.formatMatchTitle(home.name, away.name)
      route.meta.title = resolvedTitle
      document.title = Formatters.formatPageTitle(resolvedTitle)
    }
  },
  { immediate: true }
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
        <MatchComparisonChart
          v-if="comparisonChartInput"
          :match="comparisonChartInput.match"
          :home-team-name="comparisonChartInput.homeTeamName"
          :away-team-name="comparisonChartInput.awayTeamName"
        />
      </div>
      <MatchStatsSummaryCard :stat-comparisons="statComparisons" />
    </div>
  </section>

  <section
    v-else
    class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center text-slate-500"
  >
    Loading match insights...
  </section>
</template>
