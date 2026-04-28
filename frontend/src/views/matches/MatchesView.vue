// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'
import DataTable from '@/components/tables/DataTable.vue'
import MatchGoalsChart from '@/components/matches/MatchGoalsChart.vue'
import MatchesFilterPanel from '@/components/matches/MatchesFilterPanel.vue'
import MatchesHero from '@/components/matches/MatchesHero.vue'
import { Formatters } from '@/utils/Formatters'
import type {
  DataTableColumnInterface,
  DataTableRowInterface,
} from '@/interfaces/DataTableInterface'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface MatchTableRow extends DataTableRowInterface {
  date: string
  homeTeam: string
  score: string
  awayTeam: string
  stadium: string
}

interface SummaryStat {
  id: string
  label: string
  value: string
  helper: string
  accent: string
}

const router = useRouter()
const selectedTeamId = ref<string>('')

const matches = computed<MatchInterface[]>(() => MatchService.getAll())
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const teamNameMap = computed<Record<number, string>>(() => {
  return teams.value.reduce(
    (accumulator, team) => {
      accumulator[team.id] = team.name
      return accumulator
    },
    {} as Record<number, string>
  )
})

const teamOptions = computed(() =>
  teams.value.map((team) => ({
    value: team.id.toString(),
    label: team.name,
  }))
)

const filteredMatches = computed<MatchInterface[]>(() => {
  if (!selectedTeamId.value) {
    return matches.value
  }

  const teamId = Number(selectedTeamId.value)
  return matches.value.filter(
    (match: MatchInterface) => match.homeTeamId === teamId || match.awayTeamId === teamId
  )
})

function resolveTeamName(teamId: number): string {
  return teamNameMap.value[teamId] ?? 'Unknown Team'
}

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
    0
  )
  const avgGoals = Formatters.formatDecimal(totalGoals / scopedMatches.length)

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
    { match: null, totalGoals: 0 }
  )

  const latestSummary = latestMatch
    ? Formatters.formatMatchResult(
        resolveTeamName(latestMatch.homeTeamId),
        latestMatch.homeScore,
        latestMatch.awayScore,
        resolveTeamName(latestMatch.awayTeamId)
      )
    : 'Awaiting fixtures'

  const highestSummary =
    highestScoring.match !== null
      ? Formatters.formatMatchTitle(
          resolveTeamName(highestScoring.match.homeTeamId),
          resolveTeamName(highestScoring.match.awayTeamId)
        )
      : 'Awaiting fixtures'

  const highestHelper =
    highestScoring.match !== null
      ? Formatters.formatChartTooltip(highestScoring.totalGoals, 'total goals')
      : 'Track upcoming games'

  return [
    {
      id: 'tracked',
      label: 'Tracked Matches',
      value: Formatters.formatCount(scopedMatches.length),
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
      helper: latestMatch ? Formatters.formatMatchDate(latestMatch.date) : 'Awaiting fixtures',
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

const tableColumns: DataTableColumnInterface[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'homeTeam', label: 'Home Team', sortable: true },
  { key: 'score', label: 'Score' },
  { key: 'awayTeam', label: 'Away Team', sortable: true },
  { key: 'stadium', label: 'Stadium', sortable: true },
]

const tableRows = computed<MatchTableRow[]>(() =>
  [...filteredMatches.value]
    .sort((firstMatch, secondMatch) => {
      const firstDate =
        firstMatch.date instanceof Date ? firstMatch.date : new Date(firstMatch.date)
      const secondDate =
        secondMatch.date instanceof Date ? secondMatch.date : new Date(secondMatch.date)
      return secondDate.getTime() - firstDate.getTime()
    })
    .map((match: MatchInterface) => ({
      id: match.id,
      date: Formatters.formatMatchDate(match.date),
      homeTeam: resolveTeamName(match.homeTeamId),
      score: Formatters.formatScore(match.homeScore, match.awayScore),
      awayTeam: resolveTeamName(match.awayTeamId),
      stadium: match.stadium,
    }))
)

function handleRowClick(row: DataTableRowInterface): void {
  router.push({ name: 'matches.show', params: { id: row.id.toString() } })
}
</script>

<template>
  <section class="space-y-10">
    <MatchesHero :summary-stats="summaryStats" />

    <div class="grid gap-6">
      <MatchesFilterPanel v-model="selectedTeamId" :options="teamOptions" />

      <MatchGoalsChart :matches="filteredMatches" />

      <div class="rounded-3xl bg-white/95 p-1 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <DataTable :columns="tableColumns" :rows="tableRows" @rowClick="handleRowClick" />
      </div>
    </div>
  </section>
</template>
