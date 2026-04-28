// @author: Camilo | FutStats
<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

import type { CreatePlayerDTO } from '@/dtos/PlayerDTO'
import type { TeamInterface } from '@/interfaces/TeamInterface'

type FormMode = 'create' | 'edit'

interface Props {
  mode: FormMode
  initialValues: CreatePlayerDTO
  teams: TeamInterface[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', payload: CreatePlayerDTO): void
  (e: 'delete'): void
}>()

const formState = reactive<CreatePlayerDTO>({ ...props.initialValues })
const errors = reactive<Record<keyof CreatePlayerDTO, string>>({
  fullName: '',
  imageUrl: '',
  position: '',
  nationality: '',
  shirtNumber: '',
  matchesPlayed: '',
  goals: '',
  assists: '',
  shots: '',
  passes: '',
  yellowCards: '',
  redCards: '',
  minutesPlayed: '',
  teamId: '',
})

watch(
  () => props.initialValues,
  (nextValues) => {
    Object.assign(formState, nextValues)
    clearErrors()
  },
  { deep: true }
)

const titleCopy = computed(() => (props.mode === 'create' ? 'Create Player' : 'Edit Player'))
const actionCopy = computed(() => (props.mode === 'create' ? 'Create Player' : 'Update Player'))

function clearErrors(): void {
  ;(Object.keys(errors) as (keyof CreatePlayerDTO)[]).forEach((key) => {
    errors[key] = ''
  })
}

function validateField(key: keyof CreatePlayerDTO, value: unknown): void {
  if (typeof value === 'number') {
    errors[key] = Number.isNaN(value) ? 'Value required' : ''
    return
  }

  if (typeof value === 'string') {
    errors[key] = value.trim().length === 0 ? 'Value required' : ''
    return
  }

  errors[key] = value === null || value === undefined ? 'Value required' : ''
}

function validateForm(): boolean {
  clearErrors()
  ;(
    [
      'fullName',
      'imageUrl',
      'position',
      'nationality',
      'teamId',
      'shirtNumber',
      'matchesPlayed',
      'goals',
      'assists',
      'shots',
      'passes',
      'yellowCards',
      'redCards',
      'minutesPlayed',
    ] as (keyof CreatePlayerDTO)[]
  ).forEach((key) => {
    validateField(key, formState[key])
  })

  if (formState.teamId <= 0) {
    errors.teamId = 'Select a team'
  }

  const hasErrors = (Object.values(errors) as string[]).some((message) => message.length > 0)
  return !hasErrors
}

function handleSubmit(): void {
  if (!validateForm()) {
    return
  }

  emit('submit', { ...formState })
}

function handleDelete(): void {
  emit('delete')
}
</script>

<template>
  <div
    class="rounded-[2rem] border border-slate-900/[0.07] bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
  >
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
          Roster Management
        </p>
        <h2 class="text-[2rem] font-extrabold text-slate-900">{{ titleCopy }}</h2>
        <p class="mt-[0.3rem] text-slate-600">
          Update your squad data with a unified, validated workflow.
        </p>
      </div>
      <div v-if="props.mode === 'edit'">
        <button
          type="button"
          class="cursor-pointer rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 font-semibold text-red-700 transition-colors duration-200 hover:bg-red-500/20"
          @click="handleDelete"
        >
          Delete Player
        </button>
      </div>
    </div>

    <form
      class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-5"
      @submit.prevent="handleSubmit"
    >
      <div class="col-span-full flex flex-col gap-[0.35rem]">
        <label for="fullName" class="text-sm font-semibold text-slate-900">Full Name</label>
        <input
          id="fullName"
          v-model="formState.fullName"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.fullName" class="text-xs text-red-600">{{ errors.fullName }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="position" class="text-sm font-semibold text-slate-900">Position</label>
        <input
          id="position"
          v-model="formState.position"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.position" class="text-xs text-red-600">{{ errors.position }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="nationality" class="text-sm font-semibold text-slate-900">Nationality</label>
        <input
          id="nationality"
          v-model="formState.nationality"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.nationality" class="text-xs text-red-600">{{ errors.nationality }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="team" class="text-sm font-semibold text-slate-900">Team</label>
        <select
          id="team"
          v-model.number="formState.teamId"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        >
          <option disabled value="">Select team</option>
          <option v-for="team in props.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.teamId" class="text-xs text-red-600">{{ errors.teamId }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="imageUrl" class="text-sm font-semibold text-slate-900">Image URL</label>
        <input
          id="imageUrl"
          v-model="formState.imageUrl"
          type="url"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.imageUrl" class="text-xs text-red-600">{{ errors.imageUrl }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="shirtNumber" class="text-sm font-semibold text-slate-900">Shirt Number</label>
        <input
          id="shirtNumber"
          v-model.number="formState.shirtNumber"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.shirtNumber" class="text-xs text-red-600">{{ errors.shirtNumber }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="matchesPlayed" class="text-sm font-semibold text-slate-900">
          Matches Played
        </label>
        <input
          id="matchesPlayed"
          v-model.number="formState.matchesPlayed"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.matchesPlayed" class="text-xs text-red-600">{{ errors.matchesPlayed }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="minutesPlayed" class="text-sm font-semibold text-slate-900">
          Minutes Played
        </label>
        <input
          id="minutesPlayed"
          v-model.number="formState.minutesPlayed"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.minutesPlayed" class="text-xs text-red-600">{{ errors.minutesPlayed }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="goals" class="text-sm font-semibold text-slate-900">Goals</label>
        <input
          id="goals"
          v-model.number="formState.goals"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.goals" class="text-xs text-red-600">{{ errors.goals }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="assists" class="text-sm font-semibold text-slate-900">Assists</label>
        <input
          id="assists"
          v-model.number="formState.assists"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.assists" class="text-xs text-red-600">{{ errors.assists }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="shots" class="text-sm font-semibold text-slate-900">Shots</label>
        <input
          id="shots"
          v-model.number="formState.shots"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.shots" class="text-xs text-red-600">{{ errors.shots }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="passes" class="text-sm font-semibold text-slate-900">Passes</label>
        <input
          id="passes"
          v-model.number="formState.passes"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.passes" class="text-xs text-red-600">{{ errors.passes }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="yellowCards" class="text-sm font-semibold text-slate-900">Yellow Cards</label>
        <input
          id="yellowCards"
          v-model.number="formState.yellowCards"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.yellowCards" class="text-xs text-red-600">{{ errors.yellowCards }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="redCards" class="text-sm font-semibold text-slate-900">Red Cards</label>
        <input
          id="redCards"
          v-model.number="formState.redCards"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.redCards" class="text-xs text-red-600">{{ errors.redCards }}</p>
      </div>

      <div class="col-span-full flex flex-col gap-[0.35rem]">
        <button
          type="submit"
          class="cursor-pointer rounded-full border-0 bg-gradient-to-r from-[#1d4ed8] to-[#22d3ee] px-6 py-[0.85rem] font-bold text-white shadow-[0_25px_60px_rgba(37,99,235,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {{ actionCopy }}
        </button>
      </div>
    </form>
  </div>
</template>
