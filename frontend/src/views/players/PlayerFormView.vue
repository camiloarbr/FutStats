<script setup lang="ts">
// @author: Victor Chavez | FutStats
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PlayerFormCard from '@/components/players/PlayerFormCard.vue'

import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import type { CreatePlayerDTO, PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

const route = useRoute()
const router = useRouter()

const mode = computed<'create' | 'edit'>(() =>
  route.name === 'players.edit' ? 'edit' : 'create',
)

const playerId = computed<number>(() => Number(route.params.id))

const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const player = computed<PlayerInterface | undefined>(() => {
  if (mode.value === 'edit' && Number.isFinite(playerId.value)) {
    return PlayerService.getById(playerId.value)
  }
  return undefined
})

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

const formValues = computed<CreatePlayerDTO>(() => buildFormValues(player.value))

watch(
  () => ({ isEdit: mode.value === 'edit', player: player.value }),
  ({ isEdit, player: currentPlayer }) => {
    if (isEdit && currentPlayer === undefined) {
      router.replace({ name: 'players.index' })
    }
  },
  { immediate: true },
)

function handleSubmit(payload: CreatePlayerDTO): void {
  if (mode.value === 'create') {
    PlayerService.create(payload)
  } else if (playerId.value && !Number.isNaN(playerId.value)) {
    PlayerService.update(playerId.value, payload)
  }

  router.push({ name: 'players.index' })
}

function handleDelete(): void {
  if (mode.value === 'edit' && playerId.value && !Number.isNaN(playerId.value)) {
    PlayerService.delete(playerId.value)
  }

  router.push({ name: 'players.index' })
}

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
