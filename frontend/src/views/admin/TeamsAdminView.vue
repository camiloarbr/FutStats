// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { TeamService } from '@/services/TeamService'

import TeamFormCard from '@/components/teams/TeamFormCard.vue'

import type { CreateTeamDTO } from '@/dtos/TeamDTO'
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

async function handleTeamCreate(payload: CreateTeamDTO): Promise<void> {
  try {
    await TeamService.create(payload)
    teamCreateFeedback.value = 'success'
    teamFormSeed.value += 1
  } catch (error) {
    console.error(error)
    teamCreateFeedback.value = 'error'
  }
}

async function handleTeamUpdate(payload: CreateTeamDTO): Promise<void> {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  try {
    const updated = await TeamService.update(editableTeam.value.id, payload)
    teamEditFeedback.value = updated ? 'success' : 'error'
  } catch (error) {
    console.error(error)
    teamEditFeedback.value = 'error'
  }
}

async function handleTeamDelete(): Promise<void> {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  try {
    const deleted = await TeamService.delete(editableTeam.value.id)
    teamEditFeedback.value = deleted ? 'success' : 'error'

    if (deleted) {
      const nextId = teams.value[0]?.id
      selectedTeamId.value = nextId ? nextId.toString() : ''
    }
  } catch (error) {
    console.error(error)
    teamEditFeedback.value = 'error'
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
        <h1 class="text-[clamp(2rem,4vw,2.8rem)] font-extrabold">Teams Administration</h1>
        <p class="max-w-[32rem] text-white/90">
          Create, update, and remove teams from a single workspace.
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
          :aria-expanded="isSectionOpen('teamsCreate')"
          @click="toggleSection('teamsCreate')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Teams</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Register new team</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('teamsCreate') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('teamsCreate')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <TeamFormCard
            mode="create"
            :initial-values="teamInitialValues"
            @submit="handleTeamCreate"
          />
          <p
            v-if="teamCreateFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Team registered successfully.
          </p>
          <p
            v-else-if="teamCreateFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Unable to store the new team. Please try again.
          </p>
        </div>
      </article>

      <article
        class="rounded-[1.5rem] border border-slate-900/[0.08] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-6 py-5 text-left"
          :aria-expanded="isSectionOpen('teamsEdit')"
          @click="toggleSection('teamsEdit')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Teams</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Edit or delete team</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('teamsEdit') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('teamsEdit')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <div
            v-if="teams.length === 0"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
            No teams exist yet. Create one first to unlock editing.
          </div>
          <div v-else class="flex flex-col gap-2">
            <label for="team-select" class="text-sm font-semibold text-slate-900">
              Select a team
            </label>
            <select
              id="team-select"
              v-model="selectedTeamId"
              class="rounded-2xl border border-slate-300/60 px-[0.9rem] py-[0.6rem] font-medium text-slate-900"
            >
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
          <p
            v-if="teamEditFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Team updated successfully.
          </p>
          <p
            v-else-if="teamEditFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Could not update or delete the selected team.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
