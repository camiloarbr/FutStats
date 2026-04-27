// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { TeamService } from '@/services/TeamService'

import TeamFormCard from '@/components/teams/TeamFormCard.vue'

import type { CreateTeamDTO } from '@/interfaces/TeamDTO'
import type { TeamInterface } from '@/interfaces/TeamInterface'

type TeamsAccordionSection = 'teamsCreate' | 'teamsEdit'

const teams = computed<TeamInterface[]>(() => TeamService.getAll())

const accordionState = ref<Record<TeamsAccordionSection, boolean>>({
  teamsCreate: true,
  teamsEdit: false,
})

const teamCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const teamEditFeedback = ref<'idle' | 'success' | 'error'>('idle')

const teamFormSeed = ref(0)
const selectedTeamId = ref<string>('')

function toggleSection(section: TeamsAccordionSection): void {
  accordionState.value[section] = !accordionState.value[section]
}

function isSectionOpen(section: TeamsAccordionSection): boolean {
  return accordionState.value[section]
}

function buildDefaultTeam(): CreateTeamDTO {
  return {
    imageUrl: '',
    name: '',
    country: '',
    league: '',
    foundedYear: new Date().getFullYear(),
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }
}

const teamInitialValues = computed<CreateTeamDTO>(() => {
  void teamFormSeed.value
  return buildDefaultTeam()
})

function mapTeamToDto(team: TeamInterface): CreateTeamDTO {
  const { id, ...rest } = team
  void id
  return { ...rest }
}

const editableTeam = computed<TeamInterface | undefined>(() => {
  const id = Number(selectedTeamId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }

  return teams.value.find((team) => team.id === id)
})

const editableTeamValues = computed<CreateTeamDTO | null>(() => {
  if (!editableTeam.value) {
    return null
  }

  return mapTeamToDto(editableTeam.value)
})

const teamOptions = computed(() =>
  teams.value.map((team) => ({
    value: team.id.toString(),
    label: team.name,
  }))
)

watch(
  teams,
  (nextTeams) => {
    if (nextTeams.length === 0) {
      selectedTeamId.value = ''
      return
    }

    const exists = nextTeams.some((team) => team.id.toString() === selectedTeamId.value)
    if (!exists) {
      const firstTeam = nextTeams[0]
      selectedTeamId.value = firstTeam ? firstTeam.id.toString() : ''
    }
  },
  { immediate: true }
)

function handleTeamCreate(payload: CreateTeamDTO): void {
  try {
    TeamService.create(payload)
    teamCreateFeedback.value = 'success'
    teamFormSeed.value += 1
  } catch (error) {
    console.error(error)
    teamCreateFeedback.value = 'error'
  }
}

function handleTeamUpdate(payload: CreateTeamDTO): void {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  try {
    const updated = TeamService.update(editableTeam.value.id, payload)
    teamEditFeedback.value = updated ? 'success' : 'error'
  } catch (error) {
    console.error(error)
    teamEditFeedback.value = 'error'
  }
}

function handleTeamDelete(): void {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  const deleted = TeamService.delete(editableTeam.value.id)
  teamEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = teams.value[0]?.id
    selectedTeamId.value = nextId ? nextId.toString() : ''
  }
}
</script>

<template>
  <section class="space-y-8">
    <header class="hero">
      <div>
        <p class="hero-chip">Admin Center</p>
        <h1>Teams Administration</h1>
        <p>Create, update, and remove teams from a single workspace.</p>
      </div>
    </header>

    <div class="accordion-group">
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('teamsCreate')"
          @click="toggleSection('teamsCreate')"
        >
          <div>
            <p>Teams</p>
            <h3>Register new team</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('teamsCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('teamsCreate')" class="accordion__panel">
          <TeamFormCard
            mode="create"
            :initial-values="teamInitialValues"
            @submit="handleTeamCreate"
          />
          <p v-if="teamCreateFeedback === 'success'" class="success-banner">
            Team registered successfully.
          </p>
          <p v-else-if="teamCreateFeedback === 'error'" class="error-banner">
            Unable to store the new team. Please try again.
          </p>
        </div>
      </article>

      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('teamsEdit')"
          @click="toggleSection('teamsEdit')"
        >
          <div>
            <p>Teams</p>
            <h3>Edit or delete team</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('teamsEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div v-show="isSectionOpen('teamsEdit')" class="accordion__panel">
          <div v-if="teams.length === 0" class="warning">
            No teams exist yet. Create one first to unlock editing.
          </div>
          <div v-else class="selector">
            <label for="team-select">Select a team</label>
            <select id="team-select" v-model="selectedTeamId">
              <option v-for="option in teamOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <TeamFormCard
            v-if="editableTeamValues"
            key="team-edit"
            mode="edit"
            :initial-values="editableTeamValues"
            @submit="handleTeamUpdate"
            @delete="handleTeamDelete"
          />
          <p v-if="teamEditFeedback === 'success'" class="success-banner">
            Team updated successfully.
          </p>
          <p v-else-if="teamEditFeedback === 'error'" class="error-banner">
            Could not update or delete the selected team.
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
