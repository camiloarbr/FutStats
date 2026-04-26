// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import PlayerFormCard from '@/components/players/PlayerFormCard.vue'

import type { CreatePlayerDTO } from '@/interfaces/PlayerDTO'
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
  })),
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
  { immediate: true },
)

function handlePlayerCreate(payload: CreatePlayerDTO): void {
  try {
    PlayerService.create(payload)
    playerCreateFeedback.value = 'success'
    playerFormSeed.value += 1
  } catch (error) {
    console.error(error)
    playerCreateFeedback.value = 'error'
  }
}

function handlePlayerUpdate(payload: CreatePlayerDTO): void {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  try {
    PlayerService.update(editablePlayer.value.id, payload)
    playerEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    playerEditFeedback.value = 'error'
  }
}

function handlePlayerDelete(): void {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  const deleted = PlayerService.delete(editablePlayer.value.id)
  playerEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = players.value[0]?.id
    selectedPlayerId.value = nextId ? nextId.toString() : ''
  }
}
</script>

<template>
  <section class="space-y-8">
    <header class="hero">
      <div>
        <p class="hero-chip">Admin Center</p>
        <h1>Players Administration</h1>
        <p>Create, update, and remove players while keeping team links consistent.</p>
      </div>
    </header>

    <div class="accordion-group">
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('playersCreate')"
          @click="toggleSection('playersCreate')"
        >
          <div>
            <p>Players</p>
            <h3>Register new player</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('playersCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('playersCreate')" class="accordion__panel">
          <div v-if="teams.length === 0" class="warning">
            Add at least one team before registering players.
          </div>
          <PlayerFormCard
            v-else
            mode="create"
            :initial-values="playerInitialValues"
            :teams="teams"
            @submit="handlePlayerCreate"
          />
          <p v-if="playerCreateFeedback === 'success'" class="success-banner">
            Player added successfully to the roster.
          </p>
          <p v-else-if="playerCreateFeedback === 'error'" class="error-banner">
            Player could not be saved. Please try again.
          </p>
        </div>
      </article>

      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('playersEdit')"
          @click="toggleSection('playersEdit')"
        >
          <div>
            <p>Players</p>
            <h3>Edit or delete player</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('playersEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('playersEdit')" class="accordion__panel">
          <div v-if="players.length === 0" class="warning">There are no players stored yet.</div>
          <div v-else class="selector">
            <label for="player-select">Select a player</label>
            <select id="player-select" v-model="selectedPlayerId">
              <option v-for="option in playerOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div v-if="teams.length === 0" class="warning">
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
          <p v-if="playerEditFeedback === 'success'" class="success-banner">
            Player updated successfully.
          </p>
          <p v-else-if="playerEditFeedback === 'error'" class="error-banner">
            Could not update or delete the selected player.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.hero {
  border-radius: 1.75rem;
  background: linear-gradient(120deg, #0f172a, #1d4ed8, #22d3ee);
  padding: 2rem;
  color: #fff;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

.hero-chip {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.hero h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
}

.hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 32rem;
}

.accordion-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.08);
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.accordion__trigger p {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #64748b;
}

.accordion__trigger h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.chevron {
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.4rem 0.65rem;
  transition: transform 0.2s ease;
}

.chevron--open {
  transform: rotate(180deg);
}

.accordion__panel {
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.selector select {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.6rem 0.9rem;
  font-weight: 500;
  color: #0f172a;
}

.warning {
  border-radius: 1.25rem;
  border: 1px dashed rgba(245, 158, 11, 0.6);
  background: rgba(251, 191, 36, 0.2);
  color: #92400e;
  padding: 1rem 1.25rem;
}

.success-banner,
.error-banner {
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-weight: 600;
  text-align: center;
}

.success-banner {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.error-banner {
  background: rgba(248, 113, 113, 0.1);
  color: #b91c1c;
}
</style>
