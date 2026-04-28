// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import type { CreateTeamDTO } from '@/dtos/TeamDTO'

type FormMode = 'create' | 'edit'

interface Props {
  mode: FormMode
  initialValues: CreateTeamDTO
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', payload: CreateTeamDTO): void
  (e: 'delete'): void
}>()

const formState = reactive<CreateTeamDTO>({ ...props.initialValues })
const errors = reactive<Record<keyof CreateTeamDTO, string>>({
  imageUrl: '',
  name: '',
  country: '',
  league: '',
  foundedYear: '',
  matchesPlayed: '',
  wins: '',
  draws: '',
  losses: '',
  goalsFor: '',
  goalsAgainst: '',
  points: '',
})

watch(
  () => props.initialValues,
  (nextValues) => {
    Object.assign(formState, nextValues)
    clearErrors()
  },
  { deep: true }
)

const titleCopy = computed(() =>
  props.mode === 'create' ? 'Register new team' : 'Edit team information'
)
const actionCopy = computed(() => (props.mode === 'create' ? 'Create Team' : 'Update Team'))

function clearErrors(): void {
  ;(Object.keys(errors) as (keyof CreateTeamDTO)[]).forEach((key) => {
    errors[key] = ''
  })
}

function validateField(key: keyof CreateTeamDTO, value: unknown): void {
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
  ;(Object.keys(formState) as (keyof CreateTeamDTO)[]).forEach((key) => {
    validateField(key, formState[key])
  })

  return (Object.values(errors) as string[]).every((message) => message.length === 0)
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
    class="rounded-[2rem] border border-slate-900/[0.07] bg-white p-8 shadow-[0_35px_80px_rgba(15,23,42,0.08)]"
  >
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
          Team management
        </p>
        <h2 class="mt-[0.4rem] text-[2rem] font-extrabold text-slate-900">{{ titleCopy }}</h2>
        <p class="text-slate-600">
          Keep league data aligned by managing every attribute from a single validated workflow.
        </p>
      </div>
      <button
        v-if="props.mode === 'edit'"
        type="button"
        class="cursor-pointer rounded-full border border-red-500/35 bg-red-500/10 px-4 py-2 font-semibold text-red-700 transition-colors duration-200 hover:bg-red-500/20"
        @click="handleDelete"
      >
        Delete Team
      </button>
    </div>

    <form
      class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-5"
      @submit.prevent="handleSubmit"
    >
      <div class="col-span-full flex flex-col gap-[0.35rem]">
        <label for="name" class="text-sm font-semibold text-slate-900">Team Name</label>
        <input
          id="name"
          v-model="formState.name"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.name" class="text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="country" class="text-sm font-semibold text-slate-900">Country</label>
        <input
          id="country"
          v-model="formState.country"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.country" class="text-xs text-red-600">{{ errors.country }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="league" class="text-sm font-semibold text-slate-900">League</label>
        <input
          id="league"
          v-model="formState.league"
          type="text"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.league" class="text-xs text-red-600">{{ errors.league }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="foundedYear" class="text-sm font-semibold text-slate-900">Founded Year</label>
        <input
          id="foundedYear"
          v-model.number="formState.foundedYear"
          type="number"
          min="1800"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.foundedYear" class="text-xs text-red-600">{{ errors.foundedYear }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="imageUrl" class="text-sm font-semibold text-slate-900">Badge URL</label>
        <input
          id="imageUrl"
          v-model="formState.imageUrl"
          type="url"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.imageUrl" class="text-xs text-red-600">{{ errors.imageUrl }}</p>
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
        <label for="wins" class="text-sm font-semibold text-slate-900">Wins</label>
        <input
          id="wins"
          v-model.number="formState.wins"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.wins" class="text-xs text-red-600">{{ errors.wins }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="draws" class="text-sm font-semibold text-slate-900">Draws</label>
        <input
          id="draws"
          v-model.number="formState.draws"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.draws" class="text-xs text-red-600">{{ errors.draws }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="losses" class="text-sm font-semibold text-slate-900">Losses</label>
        <input
          id="losses"
          v-model.number="formState.losses"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.losses" class="text-xs text-red-600">{{ errors.losses }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="goalsFor" class="text-sm font-semibold text-slate-900">Goals For</label>
        <input
          id="goalsFor"
          v-model.number="formState.goalsFor"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.goalsFor" class="text-xs text-red-600">{{ errors.goalsFor }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="goalsAgainst" class="text-sm font-semibold text-slate-900">Goals Against</label>
        <input
          id="goalsAgainst"
          v-model.number="formState.goalsAgainst"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.goalsAgainst" class="text-xs text-red-600">{{ errors.goalsAgainst }}</p>
      </div>

      <div class="flex flex-col gap-[0.35rem]">
        <label for="points" class="text-sm font-semibold text-slate-900">Points</label>
        <input
          id="points"
          v-model.number="formState.points"
          type="number"
          min="0"
          class="rounded-2xl border border-slate-300/60 bg-white px-[0.9rem] py-[0.65rem] text-[0.95rem] font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/15"
        />
        <p v-if="errors.points" class="text-xs text-red-600">{{ errors.points }}</p>
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
