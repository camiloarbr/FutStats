<script setup lang="ts">
// @author: Victor Chavez | FutStats
// Vue reactivity utilities
import { computed, watch } from 'vue'
// Router utilities
import { useRoute, useRouter } from 'vue-router'

// Feature components
import PlayerFormCard from '@/components/players/PlayerFormCard.vue'

// Domain services
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

// Domain interfaces
import type { CreatePlayerDTO, PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

// Router helpers
const route = useRoute()
const router = useRouter()

// Determines whether we are creating or editing
const mode = computed<'create' | 'edit'>(() =>
  route.name === 'players.edit' ? 'edit' : 'create',
)

// Pull id from route params
const playerId = computed<number>(() => Number(route.params.id))

// Required team dataset
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

// Player entity when editing
const player = computed<PlayerInterface | undefined>(() => {
  if (mode.value === 'edit' && Number.isFinite(playerId.value)) {
    return PlayerService.getById(playerId.value)
  }
  return undefined
})

// Conform entity data into DTO shape
function buildFormValues(source?: PlayerInterface): CreatePlayerDTO {
  if (source) {
    const { id, ...rest } = source
    void id
    return { ...rest }
  }

  return {
    imageUrl: '',
    fullName: '',
    position: '',
    nationality: '',
    shirtNumber: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    shots: 0,
    passes: 0,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 0,
    teamId: teams.value[0]?.id ?? 0,
  }
}

// Provide initial values for the form card
const formValues = computed<CreatePlayerDTO>(() => buildFormValues(player.value))

// Redirect away if editing non-existing entities
watch(
  () => ({ isEdit: mode.value === 'edit', player: player.value }),
  ({ isEdit, player: currentPlayer }) => {
    if (isEdit && currentPlayer === undefined) {
      router.replace({ name: 'players.index' })
    }
  },
  { immediate: true },
)

// Persist player changes through the service
function handleSubmit(payload: CreatePlayerDTO): void {
  if (mode.value === 'create') {
    PlayerService.create(payload)
  } else if (playerId.value && !Number.isNaN(playerId.value)) {
    PlayerService.update(playerId.value, payload)
  }

  router.push({ name: 'players.index' })
}

// Remove player via service
function handleDelete(): void {
  if (mode.value === 'edit' && playerId.value && !Number.isNaN(playerId.value)) {
    PlayerService.delete(playerId.value)
  }

  router.push({ name: 'players.index' })
}

// UI warning when no teams exist
const showTeamsWarning = computed(() => teams.value.length === 0)
</script>

<template>
  <section class="space-y-6">
    <div
      v-if="showTeamsWarning"
      class="rounded-2xl border border-dashed border-amber-200 bg-amber-50 p-4 text-amber-800"
    >
      Add at least one team before creating player records.
    </div>

    <PlayerFormCard
      :mode="mode"
      :initial-values="formValues"
      :teams="teams"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
  </section>
</template>
