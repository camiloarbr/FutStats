// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal imports
import PlayersFilterPanel from '@/components/players/PlayersFilterPanel.vue'
import PlayersTable from '@/components/players/PlayersTable.vue'
import PlayerTopScorersChart from '@/components/players/PlayerTopScorersChart.vue'
import DataStateBanner from '@/components/ui/DataStateBanner.vue'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { FutStatsDataService } from '@/services/FutStatsDataService'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'
import { useDataStatusStore } from '@/stores/useDataStatusStore'
import { Formatters } from '@/utils/Formatters'

interface SelectOption {
  value: string
  label: string
}

const router = useRouter()
const dataStatusStore = useDataStatusStore()

const selectedTeamId = ref<string>('')
const selectedPosition = ref<string>('')

const players = computed<PlayerInterface[]>(() => PlayerService.getAll())
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const teamNameMap = computed<Record<number, string>>(() =>
  teams.value.reduce(
    (accumulator, team) => {
      accumulator[team.id] = team.name
      return accumulator
    },
    {} as Record<number, string>
  )
)

const teamOptions = computed<SelectOption[]>(() =>
  [...teams.value]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((team) => ({ value: team.id.toString(), label: team.name }))
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

const filteredPlayers = computed<PlayerInterface[]>(() => {
  return players.value.filter((player) => {
    const matchesTeam = selectedTeamId.value ? player.teamId === Number(selectedTeamId.value) : true
    const matchesPosition = selectedPosition.value
      ? player.position === selectedPosition.value
      : true
    return matchesTeam && matchesPosition
  })
})

function handlePlayerClick(id: number): void {
  router.push({ name: 'players.show', params: { id: id.toString() } })
}

const totalPlayersCopy = computed(() =>
  Formatters.formatFilterStatus(
    selectedTeamId.value || selectedPosition.value
      ? filteredPlayers.value.length
      : players.value.length,
    Boolean(selectedTeamId.value || selectedPosition.value)
  )
)

function reloadData(): void {
  void FutStatsDataService.loadInitialData()
}
</script>

<template>
  <section class="space-y-10">
    <header
      class="flex flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-[0.75rem] font-bold uppercase tracking-[0.35em] text-white/75">
          Player Intelligence
        </p>
        <h1 class="mt-[0.25rem] text-[clamp(2rem,4vw,2.75rem)] font-extrabold">Players Overview</h1>
        <p class="max-w-[32rem] text-white/90">
          Audit every squad member with live filters, sortable tables, and immediate insight into
          who is producing the most end product.
        </p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.2em] text-white/70">Roster</span>
          <strong class="block text-[1.65rem] font-extrabold">{{ totalPlayersCopy }}</strong>
        </div>
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.2em] text-white/70">Teams tracked</span>
          <strong class="block text-[1.65rem] font-extrabold">{{ teams.length }}</strong>
        </div>
      </div>
    </header>

    <DataStateBanner
      :error-message="dataStatusStore.errorMessage"
      :is-loading="dataStatusStore.isLoading"
      @retry="reloadData"
    />

    <div class="grid gap-6">
      <PlayersFilterPanel
        v-model:selected-team-id="selectedTeamId"
        v-model:selected-position="selectedPosition"
        :team-options="teamOptions"
        :position-options="positionOptions"
      />

      <PlayerTopScorersChart :players="filteredPlayers" />

      <div class="rounded-[1.75rem] bg-white p-4 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <PlayersTable
          :players="filteredPlayers"
          :team-names="teamNameMap"
          @player-click="handlePlayerClick"
        />
      </div>
    </div>
  </section>
</template>
