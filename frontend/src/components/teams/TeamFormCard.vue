// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import type { CreateTeamDTO } from '@/interfaces/TeamInterface'

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
  { deep: true },
)

const titleCopy = computed(() =>
  props.mode === 'create' ? 'Register new team' : 'Edit team information',
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
  <div class="team-form">
    <div class="team-form__header">
      <div>
        <p class="form-chip">Team management</p>
        <h2>{{ titleCopy }}</h2>
        <p>Keep league data aligned by managing every attribute from a single validated workflow.</p>
      </div>
      <button
        v-if="props.mode === 'edit'"
        type="button"
        class="team-form__danger"
        @click="handleDelete"
      >
        Delete Team
      </button>
    </div>

    <form class="team-form__grid" @submit.prevent="handleSubmit">
      <div class="field-group field-group--full">
        <label for="name">Team Name</label>
        <input id="name" v-model="formState.name" type="text" />
        <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
      </div>

      <div class="field-group">
        <label for="country">Country</label>
        <input id="country" v-model="formState.country" type="text" />
        <p v-if="errors.country" class="field-error">{{ errors.country }}</p>
      </div>

      <div class="field-group">
        <label for="league">League</label>
        <input id="league" v-model="formState.league" type="text" />
        <p v-if="errors.league" class="field-error">{{ errors.league }}</p>
      </div>

      <div class="field-group">
        <label for="foundedYear">Founded Year</label>
        <input id="foundedYear" v-model.number="formState.foundedYear" type="number" min="1800" />
        <p v-if="errors.foundedYear" class="field-error">{{ errors.foundedYear }}</p>
      </div>

      <div class="field-group">
        <label for="imageUrl">Badge URL</label>
        <input id="imageUrl" v-model="formState.imageUrl" type="url" />
        <p v-if="errors.imageUrl" class="field-error">{{ errors.imageUrl }}</p>
      </div>

      <div class="field-group">
        <label for="matchesPlayed">Matches Played</label>
        <input id="matchesPlayed" v-model.number="formState.matchesPlayed" type="number" min="0" />
        <p v-if="errors.matchesPlayed" class="field-error">{{ errors.matchesPlayed }}</p>
      </div>

      <div class="field-group">
        <label for="wins">Wins</label>
        <input id="wins" v-model.number="formState.wins" type="number" min="0" />
        <p v-if="errors.wins" class="field-error">{{ errors.wins }}</p>
      </div>

      <div class="field-group">
        <label for="draws">Draws</label>
        <input id="draws" v-model.number="formState.draws" type="number" min="0" />
        <p v-if="errors.draws" class="field-error">{{ errors.draws }}</p>
      </div>

      <div class="field-group">
        <label for="losses">Losses</label>
        <input id="losses" v-model.number="formState.losses" type="number" min="0" />
        <p v-if="errors.losses" class="field-error">{{ errors.losses }}</p>
      </div>

      <div class="field-group">
        <label for="goalsFor">Goals For</label>
        <input id="goalsFor" v-model.number="formState.goalsFor" type="number" min="0" />
        <p v-if="errors.goalsFor" class="field-error">{{ errors.goalsFor }}</p>
      </div>

      <div class="field-group">
        <label for="goalsAgainst">Goals Against</label>
        <input id="goalsAgainst" v-model.number="formState.goalsAgainst" type="number" min="0" />
        <p v-if="errors.goalsAgainst" class="field-error">{{ errors.goalsAgainst }}</p>
      </div>

      <div class="field-group">
        <label for="points">Points</label>
        <input id="points" v-model.number="formState.points" type="number" min="0" />
        <p v-if="errors.points" class="field-error">{{ errors.points }}</p>
      </div>

      <div class="field-group field-group--full">
        <button type="submit">{{ actionCopy }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.team-form {
  border-radius: 2rem;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #fff;
  padding: 2rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.08);
}

.team-form__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .team-form__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.form-chip {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-weight: 600;
  color: #3b82f6;
}

.team-form__header h2 {
  margin-top: 0.4rem;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.team-form__header p {
  color: #475569;
}

.team-form__danger {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1rem;
}

.team-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-group--full {
  grid-column: 1 / -1;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

input {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.65rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f172a;
  background: #fff;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.field-error {
  font-size: 0.75rem;
  color: #dc2626;
}

button[type='submit'] {
  border-radius: 999px;
  background: linear-gradient(120deg, #1d4ed8, #22d3ee);
  color: #fff;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border: none;
  box-shadow: 0 25px 60px rgba(37, 99, 235, 0.25);
}
</style>
