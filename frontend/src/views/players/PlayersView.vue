// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

import BaseChart from '@/components/charts/BaseChart.vue'
import DataTable from '@/components/tables/DataTable.vue'
import SelectFilter from '@/components/filters/SelectFilter.vue'

import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface SelectOption {
  value: string
  label: string
}

interface PlayerTableRow {
  id: number
  name: string
  team: string
  position: string
  goals: number
  assists: number
  matchesPlayed: number
}

type PlayerColumnKey = Exclude<keyof PlayerTableRow, 'id'>

interface TableColumn {
  key: PlayerColumnKey
  label: string
  sortable?: boolean
}

const router = useRouter()

const selectedTeamId = ref<string>('')
const selectedPosition = ref<string>('')

const players = computed<PlayerInterface[]>(() => PlayerService.getAll())
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const teamNameMap = computed<Record<number, string>>(() =>
  teams.value.reduce((accumulator, team) => {
    accumulator[team.id] = team.name
    return accumulator
  }, {} as Record<number, string>),
)

const teamOptions = computed<SelectOption[]>(() =>
  [...teams.value]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team) => ({ value: team.id.toString(), label: team.name })),
)

const positionOptions = computed<SelectOption[]>(() => {
  const positions = new Set<string>()
  players.value.forEach((player) => {
    const normalized = player.position.trim()
    if (normalized.length > 0) {
      positions.add(normalized)
    }
  })

  return [...positions]
    .sort((a, b) => a.localeCompare(b))
    .map((position) => ({ value: position, label: position }))
})

function resolveTeamName(teamId: number): string {
  return teamNameMap.value[teamId] ?? 'Unknown Team'
}

const filteredPlayers = computed<PlayerInterface[]>(() => {
  return players.value.filter((player) => {
    const matchesTeam = selectedTeamId.value
      ? player.teamId === Number(selectedTeamId.value)
      : true
    const matchesPosition = selectedPosition.value
      ? player.position === selectedPosition.value
      : true
    return matchesTeam && matchesPosition
  })
})

const tableColumns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'team', label: 'Team', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'goals', label: 'Goals', sortable: true },
  { key: 'assists', label: 'Assists', sortable: true },
  { key: 'matchesPlayed', label: 'Matches', sortable: true },
]

const tableRows = computed<PlayerTableRow[]>(() =>
  filteredPlayers.value.map((player) => ({
    id: player.id,
    name: player.fullName,
    team: resolveTeamName(player.teamId),
    position: player.position,
    goals: player.goals,
    assists: player.assists,
    matchesPlayed: player.matchesPlayed,
  })),
)

const chartPlayers = computed<PlayerInterface[]>(() =>
  [...filteredPlayers.value].sort((a, b) => b.goals - a.goals).slice(0, 10),
)

const topScorersChartData = computed<ChartData<'bar'>>(() => ({
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

const topScorersChartOptions = computed<ChartOptions<'bar'>>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'bar'>) {
          const goals = context.parsed.y ?? 0
          return `${goals} goals`
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
}))

function handleRowClick(row: PlayerTableRow): void {
  router.push({ name: 'players.show', params: { id: row.id.toString() } })
}

const totalPlayersCopy = computed(() =>
  selectedTeamId.value || selectedPosition.value
    ? `${filteredPlayers.value.length} filtered`
    : `${players.value.length} total`,
)
</script>

<template>
  <section class="space-y-10">
    <header class="players-hero">
      <div>
        <p class="hero-chip">Player Intelligence</p>
        <h1>Players Overview</h1>
        <p>
          Audit every squad member with live filters, sortable tables, and immediate insight into
          who is producing the most end product.
        </p>
      </div>
      <div class="hero-metrics">
        <div>
          <span>Roster</span>
          <strong>{{ totalPlayersCopy }}</strong>
        </div>
        <div>
          <span>Teams tracked</span>
          <strong>{{ teams.length }}</strong>
        </div>
      </div>
    </header>

    <div class="grid gap-6">
      <div class="filters-panel">
        <SelectFilter
          v-model="selectedTeamId"
          label="Team"
          placeholder="All teams"
          :options="teamOptions"
        />
        <SelectFilter
          v-model="selectedPosition"
          label="Position"
          placeholder="All positions"
          :options="positionOptions"
        />
      </div>

      <BaseChart
        :data="topScorersChartData"
        :options="topScorersChartOptions"
        :height="280"
        type="bar"
        title="Top Scorers (Goals)"
      />

      <div class="table-card">
        <DataTable :columns="tableColumns" :rows="tableRows" @rowClick="handleRowClick" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.players-hero {
  border-radius: 2rem;
  background: linear-gradient(130deg, #0f172a, #1d4ed8, #22d3ee);
  color: #fff;
  padding: 2rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .players-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-chip {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
}

.players-hero h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin-top: 0.25rem;
}

.players-hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 32rem;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.hero-metrics span {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.hero-metrics strong {
  display: block;
  font-size: 1.65rem;
  font-weight: 800;
}

.filters-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  border-radius: 1.75rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  background: #fff;
  padding: 1.5rem;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
}

.table-card {
  border-radius: 1.75rem;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.12);
}
</style>
