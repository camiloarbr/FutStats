// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal imports
import PlayersFilterPanel from '@/components/players/PlayersFilterPanel.vue'
import PlayersTable from '@/components/players/PlayersTable.vue'
import PlayerTopScorersChart from '@/components/players/PlayerTopScorersChart.vue'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'
import { Formatters } from '@/utils/Formatters'

interface SelectOption {
  value: string
  label: string
}

const router = useRouter()

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
      <PlayersFilterPanel
        v-model:selected-team-id="selectedTeamId"
        v-model:selected-position="selectedPosition"
        :team-options="teamOptions"
        :position-options="positionOptions"
      />

      <PlayerTopScorersChart :players="filteredPlayers" />

      <div class="table-card">
        <PlayersTable
          :players="filteredPlayers"
          :team-names="teamNameMap"
          @player-click="handlePlayerClick"
        />
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

.table-card {
  border-radius: 1.75rem;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.12);
}
</style>
