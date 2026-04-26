// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'

import MatchFormCard from '@/components/matches/MatchFormCard.vue'

import type { CreateMatchDTO } from '@/interfaces/MatchDTO'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

type MatchesAccordionSection = 'matchesCreate' | 'matchesEdit'

const teams = computed<TeamInterface[]>(() => TeamService.getAll())
const matches = computed<MatchInterface[]>(() => MatchService.getAll())

const accordionState = ref<Record<MatchesAccordionSection, boolean>>({
  matchesCreate: true,
  matchesEdit: false,
})

const matchCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const matchEditFeedback = ref<'idle' | 'success' | 'error'>('idle')

const matchFormSeed = ref(0)
const selectedMatchId = ref<string>('')

const matchDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function toggleSection(section: MatchesAccordionSection): void {
  accordionState.value[section] = !accordionState.value[section]
}

function isSectionOpen(section: MatchesAccordionSection): boolean {
  return accordionState.value[section]
}

function buildDefaultMatch(): CreateMatchDTO {
  const defaultTeamId = teams.value[0]?.id ?? 0
  const secondaryTeamId = teams.value[1]?.id ?? 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    date: today,
    stadium: '',
    homeTeamId: defaultTeamId,
    awayTeamId: secondaryTeamId,
    homeScore: 0,
    awayScore: 0,
    possessionHome: 50,
    possessionAway: 50,
    shotsHome: 0,
    shotsAway: 0,
    foulsHome: 0,
    foulsAway: 0,
  }
}

const matchInitialValues = computed<CreateMatchDTO>(() => {
  void matchFormSeed.value
  return buildDefaultMatch()
})

function mapMatchToDto(match: MatchInterface): CreateMatchDTO {
  return {
    date: match.date instanceof Date ? match.date : new Date(match.date),
    stadium: match.stadium,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    possessionHome: match.possessionHome,
    possessionAway: match.possessionAway,
    shotsHome: match.shotsHome,
    shotsAway: match.shotsAway,
    foulsHome: match.foulsHome,
    foulsAway: match.foulsAway,
  }
}

function resolveTeamName(teamId: number): string {
  const name = teams.value.find((team) => team.id === teamId)?.name
  return name ?? 'Unknown team'
}

const editableMatch = computed<MatchInterface | undefined>(() => {
  const id = Number(selectedMatchId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }

  return matches.value.find((match) => match.id === id)
})

const editableMatchValues = computed<CreateMatchDTO | null>(() => {
  if (!editableMatch.value) {
    return null
  }

  return mapMatchToDto(editableMatch.value)
})

const matchOptions = computed(() =>
  matches.value.map((match) => ({
    value: match.id.toString(),
    label: `${matchDateFormatter.format(match.date instanceof Date ? match.date : new Date(match.date))} · ${resolveTeamName(match.homeTeamId)} vs ${resolveTeamName(match.awayTeamId)}`,
  })),
)

watch(
  matches,
  (nextMatches) => {
    if (nextMatches.length === 0) {
      selectedMatchId.value = ''
      return
    }

    const exists = nextMatches.some((match) => match.id.toString() === selectedMatchId.value)
    if (!exists) {
      const firstMatch = nextMatches[0]
      selectedMatchId.value = firstMatch ? firstMatch.id.toString() : ''
    }
  },
  { immediate: true },
)

function handleMatchCreate(payload: CreateMatchDTO): void {
  try {
    MatchService.create(payload)
    matchCreateFeedback.value = 'success'
    matchFormSeed.value += 1
  } catch (error) {
    console.error(error)
    matchCreateFeedback.value = 'error'
  }
}

function handleMatchUpdate(payload: CreateMatchDTO): void {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  try {
    MatchService.update(editableMatch.value.id, payload)
    matchEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    matchEditFeedback.value = 'error'
  }
}

function handleMatchDelete(): void {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  const deleted = MatchService.delete(editableMatch.value.id)
  matchEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = matches.value[0]?.id
    selectedMatchId.value = nextId ? nextId.toString() : ''
  }
}
</script>

<template>
  <section class="space-y-8">
    <header class="hero">
      <div>
        <p class="hero-chip">Admin Center</p>
        <h1>Matches Administration</h1>
        <p>Create, update, and remove matches while preserving team pair integrity.</p>
      </div>
    </header>

    <div class="accordion-group">
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('matchesCreate')"
          @click="toggleSection('matchesCreate')"
        >
          <div>
            <p>Matches</p>
            <h3>Register new match</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('matchesCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('matchesCreate')" class="accordion__panel">
          <div v-if="teams.length < 2" class="warning">
            Register at least two teams before creating a match. Head over to Teams to add the
            missing clubs.
          </div>
          <MatchFormCard
            v-else
            mode="create"
            :initial-values="matchInitialValues"
            :teams="teams"
            @submit="handleMatchCreate"
          />
          <p v-if="matchCreateFeedback === 'success'" class="success-banner">
            Match stored successfully. Review it later inside Matches view.
          </p>
          <p v-else-if="matchCreateFeedback === 'error'" class="error-banner">
            Something went wrong while saving. Please try again.
          </p>
        </div>
      </article>

      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('matchesEdit')"
          @click="toggleSection('matchesEdit')"
        >
          <div>
            <p>Matches</p>
            <h3>Edit or delete match</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('matchesEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('matchesEdit')" class="accordion__panel">
          <div v-if="matches.length === 0" class="warning">
            No matches exist yet. Create one to unlock editing tools.
          </div>
          <div v-else class="selector">
            <label for="match-select">Select a match</label>
            <select id="match-select" v-model="selectedMatchId">
              <option v-for="option in matchOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div v-if="teams.length < 2" class="warning">
            You need at least two active teams before editing match data.
          </div>
          <MatchFormCard
            v-else-if="editableMatchValues"
            key="match-edit"
            mode="edit"
            :initial-values="editableMatchValues"
            :teams="teams"
            @submit="handleMatchUpdate"
            @delete="handleMatchDelete"
          />
          <p v-if="matchEditFeedback === 'success'" class="success-banner">
            Changes applied to the selected match.
          </p>
          <p v-else-if="matchEditFeedback === 'error'" class="error-banner">
            Unable to process that action. Double-check the current selection.
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
