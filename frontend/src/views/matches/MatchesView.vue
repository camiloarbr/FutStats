// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Chart.js typings
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'
// Vue reactivity utilities
import { computed, ref } from 'vue'
// Router utilities
import { useRouter } from 'vue-router'

// Shared components
import BaseChart from '@/components/charts/BaseChart.vue'
import DataTable from '@/components/tables/DataTable.vue'
import MatchesFilterPanel from '@/components/matches/MatchesFilterPanel.vue'
import MatchesHero from '@/components/matches/MatchesHero.vue'

// Domain services
import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'

// Domain interfaces
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

// Table row view model
interface MatchTableRow {
  id: number
  date: string
  homeTeam: string
  score: string
  awayTeam: string
  stadium: string
}

// Column metadata
interface TableColumn {
  key: keyof MatchTableRow
  label: string
  sortable?: boolean
}

// Summary card details
interface SummaryStat {
  id: string
  label: string
  value: string
  helper: string
  accent: string
}

// Router instance and filter state
const router = useRouter()
const selectedTeamId = ref<string>('')

// Collections sourced from services
const matches = computed<MatchInterface[]>(() => MatchService.getAll())
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

// Quick lookup for team names
const teamNameMap = computed<Record<number, string>>(() => {
  return teams.value.reduce((accumulator, team) => {
    accumulator[team.id] = team.name
    return accumulator
  }, {} as Record<number, string>)
})

// Filter dropdown options
const teamOptions = computed(() =>
  teams.value.map((team) => ({
    value: team.id.toString(),
    label: team.name,
  })),
)

// Filter matches by selected club
const filteredMatches = computed<MatchInterface[]>(() => {
  if (!selectedTeamId.value) {
    return matches.value
  }

  const teamId = Number(selectedTeamId.value)
  return matches.value.filter(
    (match: MatchInterface) => match.homeTeamId === teamId || match.awayTeamId === teamId,
  )
})

// Date formatter reused across grids
const matchDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

// Friendly date helper
function formatMatchDate(dateValue: Date | string): string {
  const resolvedDate = dateValue instanceof Date ? dateValue : new Date(dateValue)
  return matchDateFormatter.format(resolvedDate)
}

// Team fallback helper
function resolveTeamName(teamId: number): string {
  return teamNameMap.value[teamId] ?? 'Unknown Team'
}

// Hero summary stats
const summaryStats = computed<SummaryStat[]>(() => {
  const scopedMatches = filteredMatches.value

  if (scopedMatches.length === 0) {
    return [
      {
        id: 'tracked',
        label: 'Tracked Matches',
        value: '0',
        helper: 'Adjust filters to load results',
        accent: 'from-blue-600 to-sky-500',
      },
      {
        id: 'avgGoals',
        label: 'Avg Goals',
        value: '0.0',
        helper: 'Per match in current scope',
        accent: 'from-sky-500 to-cyan-400',
      },
      {
        id: 'latest',
        label: 'Latest Result',
        value: 'Awaiting fixtures',
        helper: 'No games logged yet',
        accent: 'from-indigo-600 to-blue-500',
      },
      {
        id: 'high',
        label: 'Highest Scoring',
        value: 'No data',
        helper: 'Track upcoming games',
        accent: 'from-cyan-500 to-emerald-400',
      },
    ]
  }

  const totalGoals = scopedMatches.reduce(
    (accumulator, match) => accumulator + match.homeScore + match.awayScore,
    0,
  )
  const avgGoals = (totalGoals / scopedMatches.length).toFixed(1)

  const chronologic = [...scopedMatches].sort((firstMatch, secondMatch) => {
    const firstDate = firstMatch.date instanceof Date ? firstMatch.date : new Date(firstMatch.date)
    const secondDate =
      secondMatch.date instanceof Date ? secondMatch.date : new Date(secondMatch.date)
    return firstDate.getTime() - secondDate.getTime()
  })

  const latestMatch = chronologic[chronologic.length - 1]

  const highestScoring = scopedMatches.reduce<{
    match: MatchInterface | null
    totalGoals: number
  }>(
    (best, current) => {
      const goals = current.homeScore + current.awayScore
      if (goals > best.totalGoals) {
        return { match: current, totalGoals: goals }
      }
      return best
    },
    { match: null, totalGoals: 0 },
  )

  const latestSummary = latestMatch
    ? `${resolveTeamName(latestMatch.homeTeamId)} ${latestMatch.homeScore}:${latestMatch.awayScore} ${resolveTeamName(latestMatch.awayTeamId)}`
    : 'Awaiting fixtures'

  const highestSummary =
    highestScoring.match !== null
      ? `${resolveTeamName(highestScoring.match.homeTeamId)} vs ${resolveTeamName(
          highestScoring.match.awayTeamId,
        )}`
      : 'Awaiting fixtures'

  const highestHelper =
    highestScoring.match !== null
      ? `${highestScoring.totalGoals} total goals`
      : 'Track upcoming games'

  return [
    {
      id: 'tracked',
      label: 'Tracked Matches',
      value: scopedMatches.length.toString(),
      helper: 'Results within current filter',
      accent: 'from-blue-600 to-sky-500',
    },
    {
      id: 'avgGoals',
      label: 'Avg Goals',
      value: avgGoals,
      helper: 'Per match this season',
      accent: 'from-sky-500 to-cyan-400',
    },
    {
      id: 'latest',
      label: 'Latest Result',
      value: latestSummary,
      helper: latestMatch ? formatMatchDate(latestMatch.date) : 'Awaiting fixtures',
      accent: 'from-indigo-600 to-blue-500',
    },
    {
      id: 'high',
      label: 'Highest Scoring',
      value: highestSummary,
      helper: highestHelper,
      accent: 'from-cyan-500 to-emerald-400',
    },
  ]
})

// Table column definition
const tableColumns: TableColumn[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'homeTeam', label: 'Home Team', sortable: true },
  { key: 'score', label: 'Score' },
  { key: 'awayTeam', label: 'Away Team', sortable: true },
  { key: 'stadium', label: 'Stadium', sortable: true },
]

// Data table rows derived from matches
const tableRows = computed<MatchTableRow[]>(() =>
  [...filteredMatches.value]
    .sort((firstMatch, secondMatch) => {
      const firstDate = firstMatch.date instanceof Date ? firstMatch.date : new Date(firstMatch.date)
      const secondDate =
        secondMatch.date instanceof Date ? secondMatch.date : new Date(secondMatch.date)
      return secondDate.getTime() - firstDate.getTime()
    })
    .map((match: MatchInterface) => ({
      id: match.id,
      date: formatMatchDate(match.date),
      homeTeam: resolveTeamName(match.homeTeamId),
      score: `${match.homeScore} - ${match.awayScore}`,
      awayTeam: resolveTeamName(match.awayTeamId),
      stadium: match.stadium,
    })),
)

// Goals per match line chart
const goalsChartData = computed<ChartData<'line'>>(() => {
  const chronologicMatches = [...filteredMatches.value].sort((firstMatch, secondMatch) => {
    const firstDate = firstMatch.date instanceof Date ? firstMatch.date : new Date(firstMatch.date)
    const secondDate =
      secondMatch.date instanceof Date ? secondMatch.date : new Date(secondMatch.date)
    return firstDate.getTime() - secondDate.getTime()
  })

  const labels = chronologicMatches.map((match) => formatMatchDate(match.date))
  const totals = chronologicMatches.map((match) => match.homeScore + match.awayScore)

  return {
    labels,
    datasets: [
      {
        label: 'Goals per Match',
        data: totals,
        borderColor: '#2563eb',
        pointBackgroundColor: '#1d4ed8',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  }
})

// Chart options for goals trend
const goalsChartOptions = computed<ChartOptions<'line'>>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'line'>) {
          const goals = context.parsed.y ?? 0
          return `${goals} goals`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
      title: {
        display: true,
        text: 'Total Goals',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Match Date',
      },
    },
  },
}))

// Navigate to match detail when a row is clicked
function handleRowClick(row: MatchTableRow): void {
  router.push({ name: 'matches.show', params: { id: row.id.toString() } })
}
</script>

<template>
  <section class="space-y-10">
    <MatchesHero :summary-stats="summaryStats" />

    <div class="grid gap-6">
      <MatchesFilterPanel v-model="selectedTeamId" :options="teamOptions" />

      <BaseChart
        class="rounded-2xl border border-blue-50 bg-white p-4 shadow-xl shadow-blue-500/10"
        :height="240"
        type="line"
        :data="goalsChartData"
        :options="goalsChartOptions"
        title="Goals per Match"
      />

      <div class="rounded-3xl bg-white/95 p-1 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <DataTable
          :columns="tableColumns"
          :rows="tableRows"
          @rowClick="handleRowClick"
        />
      </div>
    </div>
  </section>
</template>
