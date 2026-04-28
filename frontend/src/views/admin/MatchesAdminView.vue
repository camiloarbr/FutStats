// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'

import MatchFormCard from '@/components/matches/MatchFormCard.vue'

import type { CreateMatchDTO } from '@/interfaces/MatchDTO'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

import { Formatters } from '@/utils/Formatters'

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
    label: Formatters.formatMatchLabel(
      match.date,
      resolveTeamName(match.homeTeamId),
      resolveTeamName(match.awayTeamId)
    ),
  }))
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
  { immediate: true }
)

async function handleMatchCreate(payload: CreateMatchDTO): Promise<void> {
  try {
    await MatchService.create(payload)
    matchCreateFeedback.value = 'success'
    matchFormSeed.value += 1
  } catch (error) {
    console.error(error)
    matchCreateFeedback.value = 'error'
  }
}

async function handleMatchUpdate(payload: CreateMatchDTO): Promise<void> {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  try {
    await MatchService.update(editableMatch.value.id, payload)
    matchEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    matchEditFeedback.value = 'error'
  }
}

async function handleMatchDelete(): Promise<void> {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  try {
    const deleted = await MatchService.delete(editableMatch.value.id)
    matchEditFeedback.value = deleted ? 'success' : 'error'

    if (deleted) {
      const nextId = matches.value[0]?.id
      selectedMatchId.value = nextId ? nextId.toString() : ''
    }
  } catch (error) {
    console.error(error)
    matchEditFeedback.value = 'error'
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
        <h1 class="text-[clamp(2rem,4vw,2.8rem)] font-extrabold">Matches Administration</h1>
        <p class="max-w-[32rem] text-white/90">
          Create, update, and remove matches while preserving team pair integrity.
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
          :aria-expanded="isSectionOpen('matchesCreate')"
          @click="toggleSection('matchesCreate')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Matches</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Register new match</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('matchesCreate') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('matchesCreate')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <div
            v-if="teams.length < 2"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
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
          <p
            v-if="matchCreateFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Match stored successfully. Review it later inside Matches view.
          </p>
          <p
            v-else-if="matchCreateFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Something went wrong while saving. Please try again.
          </p>
        </div>
      </article>

      <article
        class="rounded-[1.5rem] border border-slate-900/[0.08] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-6 py-5 text-left"
          :aria-expanded="isSectionOpen('matchesEdit')"
          @click="toggleSection('matchesEdit')"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Matches</p>
            <h3 class="text-[1.3rem] font-bold text-slate-900">Edit or delete match</h3>
          </div>
          <span
            class="rounded-full border border-slate-900/10 px-[0.65rem] py-[0.4rem] transition-transform duration-200"
            :class="{ 'rotate-180': isSectionOpen('matchesEdit') }"
          >
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>

        <div
          v-show="isSectionOpen('matchesEdit')"
          class="flex flex-col gap-4 border-t border-slate-200/70 p-6"
        >
          <div
            v-if="matches.length === 0"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
            No matches exist yet. Create one to unlock editing tools.
          </div>
          <div v-else class="flex flex-col gap-2">
            <label for="match-select" class="text-sm font-semibold text-slate-900">
              Select a match
            </label>
            <select
              id="match-select"
              v-model="selectedMatchId"
              class="rounded-2xl border border-slate-300/60 px-[0.9rem] py-[0.6rem] font-medium text-slate-900"
            >
              <option v-for="option in matchOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div
            v-if="teams.length < 2"
            class="rounded-[1.25rem] border border-dashed border-amber-500/60 bg-amber-400/20 p-4 px-5 text-amber-900"
          >
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
          <p
            v-if="matchEditFeedback === 'success'"
            class="rounded-full bg-emerald-500/15 px-5 py-[0.65rem] text-center font-semibold text-emerald-800"
          >
            Changes applied to the selected match.
          </p>
          <p
            v-else-if="matchEditFeedback === 'error'"
            class="rounded-full bg-red-400/10 px-5 py-[0.65rem] text-center font-semibold text-red-700"
          >
            Unable to process that action. Double-check the current selection.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
