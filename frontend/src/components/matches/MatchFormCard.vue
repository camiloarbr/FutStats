// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

import type { CreateMatchDTO } from '@/interfaces/MatchDTO'
import type { TeamInterface } from '@/interfaces/TeamInterface'

type FormMode = 'create' | 'edit'

interface MatchFormState {
  date: string
  stadium: string
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  possessionHome: number
  possessionAway: number
  shotsHome: number
  shotsAway: number
  foulsHome: number
  foulsAway: number
}

interface Props {
  mode: FormMode
  initialValues: CreateMatchDTO
  teams: TeamInterface[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', payload: CreateMatchDTO): void
  (e: 'delete'): void
}>()

const formState = reactive<MatchFormState>(buildStateFromDto(props.initialValues))
const errors = reactive<Record<keyof MatchFormState | 'general', string>>({
  date: '',
  stadium: '',
  homeTeamId: '',
  awayTeamId: '',
  homeScore: '',
  awayScore: '',
  possessionHome: '',
  possessionAway: '',
  shotsHome: '',
  shotsAway: '',
  foulsHome: '',
  foulsAway: '',
  general: '',
})

watch(
  () => props.initialValues,
  (nextValues) => {
    Object.assign(formState, buildStateFromDto(nextValues))
    clearErrors()
  },
  { deep: true }
)

const titleCopy = computed(() => (props.mode === 'create' ? 'Register new match' : 'Edit match'))
const actionCopy = computed(() => (props.mode === 'create' ? 'Save match' : 'Update match'))

function buildStateFromDto(dto: CreateMatchDTO): MatchFormState {
  return {
    date: dto.date instanceof Date ? dto.date.toISOString().slice(0, 10) : dto.date,
    stadium: dto.stadium,
    homeTeamId: dto.homeTeamId,
    awayTeamId: dto.awayTeamId,
    homeScore: dto.homeScore,
    awayScore: dto.awayScore,
    possessionHome: dto.possessionHome,
    possessionAway: dto.possessionAway,
    shotsHome: dto.shotsHome,
    shotsAway: dto.shotsAway,
    foulsHome: dto.foulsHome,
    foulsAway: dto.foulsAway,
  }
}

function clearErrors(): void {
  ;(Object.keys(errors) as (keyof typeof errors)[]).forEach((key) => {
    errors[key] = ''
  })
}

function validateField(key: keyof MatchFormState, value: unknown): void {
  if (typeof value === 'string') {
    errors[key] = value.trim().length === 0 ? 'Required field' : ''
    return
  }

  if (typeof value === 'number') {
    errors[key] = Number.isNaN(value) ? 'Value required' : ''
    return
  }

  errors[key] = value === null || value === undefined ? 'Value required' : ''
}

function validateForm(): boolean {
  clearErrors()
  ;(Object.keys(formState) as (keyof MatchFormState)[]).forEach((key) => {
    validateField(key, formState[key])
  })

  if (formState.homeTeamId === formState.awayTeamId) {
    errors.homeTeamId = 'Pick different teams'
    errors.awayTeamId = 'Pick different teams'
  }

  if (formState.possessionHome + formState.possessionAway !== 100) {
    errors.possessionHome = 'Totals must equal 100%'
    errors.possessionAway = 'Totals must equal 100%'
  }

  const hasErrors = (Object.values(errors) as string[]).some((message) => message.length > 0)
  return !hasErrors
}

function buildDtoFromState(): CreateMatchDTO {
  return {
    date: new Date(`${formState.date}T00:00:00`),
    stadium: formState.stadium.trim(),
    homeTeamId: formState.homeTeamId,
    awayTeamId: formState.awayTeamId,
    homeScore: formState.homeScore,
    awayScore: formState.awayScore,
    possessionHome: formState.possessionHome,
    possessionAway: formState.possessionAway,
    shotsHome: formState.shotsHome,
    shotsAway: formState.shotsAway,
    foulsHome: formState.foulsHome,
    foulsAway: formState.foulsAway,
  }
}

function handleSubmit(): void {
  if (!validateForm()) {
    errors.general = 'Resolve the highlighted fields before continuing.'
    return
  }

  errors.general = ''
  emit('submit', buildDtoFromState())
}

function handleDelete(): void {
  emit('delete')
}
</script>

<template>
  <div
    class="rounded-[2rem] border border-slate-900/[0.07] bg-white p-8 shadow-[0_40px_90px_rgba(15,23,42,0.08)]"
  >
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
          Admin workflow
        </p>
        <h2 class="mt-[0.4rem] text-[2rem] font-extrabold text-slate-900">{{ titleCopy }}</h2>
        <p class="text-slate-600">
          Manage official results and match stats within a single streamlined flow.
        </p>
      </div>
      <button
        v-if="props.mode === 'edit'"
        type="button"
        class="cursor-pointer rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 font-semibold text-red-700 transition-colors duration-200 hover:bg-red-500/20"
        @click="handleDelete"
      >
        Delete match
      </button>
    </div>

    <form
      class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-5"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-[0.35rem]">
        <label for="match-date" class="text-sm font-semibold text-slate-900">Date</label>
        <input
          id="match-date"
          v-model="formState.date"
          type="date"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.date" class="text-xs text-red-600">{{ errors.date }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="stadium" class="text-sm font-semibold text-slate-900">Stadium</label>
        <input
          id="stadium"
          v-model="formState.stadium"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.stadium" class="text-xs text-red-600">{{ errors.stadium }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="homeTeam" class="text-sm font-semibold text-slate-900">Home team</label>
        <select
          id="homeTeam"
          v-model.number="formState.homeTeamId"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        >
          <option disabled value="0">Select a team</option>
          <option v-for="team in props.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.homeTeamId" class="text-xs text-red-600">{{ errors.homeTeamId }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="awayTeam" class="text-sm font-semibold text-slate-900">Away team</label>
        <select
          id="awayTeam"
          v-model.number="formState.awayTeamId"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        >
          <option disabled value="0">Select a team</option>
          <option v-for="team in props.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.awayTeamId" class="text-xs text-red-600">{{ errors.awayTeamId }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="homeScore" class="text-sm font-semibold text-slate-900">Home goals</label>
        <input
          id="homeScore"
          v-model.number="formState.homeScore"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.homeScore" class="text-xs text-red-600">{{ errors.homeScore }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="awayScore" class="text-sm font-semibold text-slate-900">Away goals</label>
        <input
          id="awayScore"
          v-model.number="formState.awayScore"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.awayScore" class="text-xs text-red-600">{{ errors.awayScore }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="possessionHome" class="text-sm font-semibold text-slate-900">
          Home possession (%)
        </label>
        <input
          id="possessionHome"
          v-model.number="formState.possessionHome"
          type="number"
          min="0"
          max="100"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.possessionHome" class="text-xs text-red-600">
          {{ errors.possessionHome }}
        </p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="possessionAway" class="text-sm font-semibold text-slate-900">
          Away possession (%)
        </label>
        <input
          id="possessionAway"
          v-model.number="formState.possessionAway"
          type="number"
          min="0"
          max="100"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.possessionAway" class="text-xs text-red-600">
          {{ errors.possessionAway }}
        </p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="shotsHome" class="text-sm font-semibold text-slate-900">Home shots</label>
        <input
          id="shotsHome"
          v-model.number="formState.shotsHome"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.shotsHome" class="text-xs text-red-600">{{ errors.shotsHome }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="shotsAway" class="text-sm font-semibold text-slate-900">Away shots</label>
        <input
          id="shotsAway"
          v-model.number="formState.shotsAway"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.shotsAway" class="text-xs text-red-600">{{ errors.shotsAway }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="foulsHome" class="text-sm font-semibold text-slate-900">Home fouls</label>
        <input
          id="foulsHome"
          v-model.number="formState.foulsHome"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.foulsHome" class="text-xs text-red-600">{{ errors.foulsHome }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="foulsAway" class="text-sm font-semibold text-slate-900">Away fouls</label>
        <input
          id="foulsAway"
          v-model.number="formState.foulsAway"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.foulsAway" class="text-xs text-red-600">{{ errors.foulsAway }}</p>
      </div>

      <div class="col-span-full flex flex-col gap-[0.35rem]">
        <button
          type="submit"
          class="cursor-pointer rounded-full border-0 bg-gradient-to-r from-[#1d4ed8] to-[#22d3ee] px-6 py-[0.85rem] font-bold text-white shadow-[0_25px_60px_rgba(37,99,235,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {{ actionCopy }}
        </button>
        <p v-if="errors.general" class="text-xs text-red-600">{{ errors.general }}</p>
      </div>
    </form>
  </div>
</template>
