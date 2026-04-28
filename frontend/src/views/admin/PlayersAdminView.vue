// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import PlayerFormCard from '@/components/players/PlayerFormCard.vue'

import type { CreatePlayerDTO } from '@/dtos/PlayerDTO'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

type PlayersAccordionSection = 'playersCreate' | 'playersEdit'

const players = computed<PlayerInterface[]>(() => PlayerService.getAll())
const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const accordionState = ref<Record<PlayersAccordionSection, boolean>>({
  playersCreate: true,
  playersEdit: false,
})

const playerCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const playerEditFeedback = ref<'idle' | 'success' | 'error'>('idle')

const playerFormSeed = ref(0)
const selectedPlayerId = ref<string>('')

function toggleSection(section: PlayersAccordionSection): void {
  accordionState.value[section] = !accordionState.value[section]
}

function isSectionOpen(section: PlayersAccordionSection): boolean {
  return accordionState.value[section]
}

function buildDefaultPlayer(): CreatePlayerDTO {
  const defaultTeamId = teams.value[0]?.id ?? 0

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
    teamId: defaultTeamId,
  }
}

const playerInitialValues = computed<CreatePlayerDTO>(() => {
  void playerFormSeed.value
  return buildDefaultPlayer()
})

function mapPlayerToDto(player: PlayerInterface): CreatePlayerDTO {
  const { id, ...rest } = player
  void id
  return { ...rest }
}

const editablePlayer = computed<PlayerInterface | undefined>(() => {
  const id = Number(selectedPlayerId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }

  return players.value.find((player) => player.id === id)
})

const editablePlayerValues = computed<CreatePlayerDTO | null>(() => {
  if (!editablePlayer.value) {
    return null
  }

  return mapPlayerToDto(editablePlayer.value)
})

const playerOptions = computed(() =>
  players.value.map((player) => ({
    value: player.id.toString(),
    label: player.fullName,
  }))
)

watch(
  players,
  (nextPlayers) => {
    if (nextPlayers.length === 0) {
      selectedPlayerId.value = ''
      return
    }

    const exists = nextPlayers.some((player) => player.id.toString() === selectedPlayerId.value)
    if (!exists) {
      const firstPlayer = nextPlayers[0]
      selectedPlayerId.value = firstPlayer ? firstPlayer.id.toString() : ''
    }
  },
  { immediate: true }
)

async function handlePlayerCreate(payload: CreatePlayerDTO): Promise<void> {
  try {
    await PlayerService.create(payload)
    playerCreateFeedback.value = 'success'
    playerFormSeed.value += 1
  } catch (error) {
    console.error(error)
    playerCreateFeedback.value = 'error'
  }
}

async function handlePlayerUpdate(payload: CreatePlayerDTO): Promise<void> {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  try {
    await PlayerService.update(editablePlayer.value.id, payload)
    playerEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    playerEditFeedback.value = 'error'
  }
}

async function handlePlayerDelete(): Promise<void> {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  try {
    const deleted = await PlayerService.delete(editablePlayer.value.id)
    playerEditFeedback.value = deleted ? 'success' : 'error'

    if (deleted) {
      const nextId = players.value[0]?.id
      selectedPlayerId.value = nextId ? nextId.toString() : ''
    }
  } catch (error) {
    console.error(error)
    playerEditFeedback.value = 'error'
  }
}
</script>

<template>
  <section class="space-y-8">
    <header
      class="rounded-[1.75rem] bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)]"
    >
      <div>
        <p class="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-white/70">
          Admin Center
        </p>
        <h1 class="text-[clamp(2rem,4vw,2.8rem)] font-extrabold">Players Administration</h1>
        <p class="max-w-[32rem] text-white/90">
          Create, update, and remove players while keeping team links consistent.
        </p>
      </div>
    </header>

    <div class="flex flex-col gap-4">
      <article
        class="rounded-[1.5rem] border border-slate-900/[0.08] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-6 py-5 text-left"
          :aria-expanded="isSectionOpen('playersCreate')"
          @click="toggleSection('playersCreate')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Players</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Register new player</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('playersCreate') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('playersCreate')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <div
            v-if="teams.length === 0"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
            Add at least one team before registering players.
          </div>
          <PlayerFormCard
            v-else
            mode="create"
            :initial-values="playerInitialValues"
            :teams="teams"
            @submit="handlePlayerCreate"
          />
          <p
            v-if="playerCreateFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Player added successfully to the roster.
          </p>
          <p
            v-else-if="playerCreateFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Player could not be saved. Please try again.
          </p>
        </div>
      </article>

      <article
        class="rounded-[1.5rem] border border-slate-900/[0.08] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-6 py-5 text-left"
          :aria-expanded="isSectionOpen('playersEdit')"
          @click="toggleSection('playersEdit')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Players</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Edit or delete player</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('playersEdit') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('playersEdit')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <div
            v-if="players.length === 0"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
            There are no players stored yet.
          </div>
          <div v-else class="flex flex-col gap-2">
            <label for="player-select" class="text-sm font-semibold text-slate-900">
              Select a player
            </label>
            <select
              id="player-select"
              v-model="selectedPlayerId"
              class="rounded-2xl border border-slate-300/60 px-[0.9rem] py-[0.6rem] font-medium text-slate-900"
            >
              <option v-for="option in playerOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div
            v-if="teams.length === 0"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
            At least one team must exist to link the player.
          </div>
          <PlayerFormCard
            v-else-if="editablePlayerValues"
            key="player-edit"
            mode="edit"
            :initial-values="editablePlayerValues"
            :teams="teams"
            @submit="handlePlayerUpdate"
            @delete="handlePlayerDelete"
          />
          <p
            v-if="playerEditFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Player updated successfully.
          </p>
          <p
            v-else-if="playerEditFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Could not update or delete the selected player.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
