// @author: [Name] | FutStats
<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

import type { CreatePlayerDTO } from '@/interfaces/PlayerInterface'
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
  { deep: true },
)

const titleCopy = computed(() => (props.mode === 'create' ? 'Create Player' : 'Edit Player'))
const actionCopy = computed(() => (props.mode === 'create' ? 'Create Player' : 'Update Player'))

function clearErrors(): void {
  (Object.keys(errors) as (keyof CreatePlayerDTO)[]).forEach((key) => {
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
  <div class="player-form">
    <div class="player-form__header">
      <div>
        <p class="form-chip">Roster Management</p>
        <h2>{{ titleCopy }}</h2>
        <p>Update your squad data with a unified, validated workflow.</p>
      </div>
      <div v-if="props.mode === 'edit'" class="player-form__danger">
        <button type="button" @click="handleDelete">Delete Player</button>
      </div>
    </div>

    <form class="player-form__grid" @submit.prevent="handleSubmit">
      <div class="field-group field-group--full">
        <label for="fullName">Full Name</label>
        <input id="fullName" v-model="formState.fullName" type="text" />
        <p v-if="errors.fullName" class="field-error">{{ errors.fullName }}</p>
      </div>

      <div class="field-group">
        <label for="position">Position</label>
        <input id="position" v-model="formState.position" type="text" />
        <p v-if="errors.position" class="field-error">{{ errors.position }}</p>
      </div>

      <div class="field-group">
        <label for="nationality">Nationality</label>
        <input id="nationality" v-model="formState.nationality" type="text" />
        <p v-if="errors.nationality" class="field-error">{{ errors.nationality }}</p>
      </div>

      <div class="field-group">
        <label for="team">Team</label>
        <select id="team" v-model.number="formState.teamId">
          <option disabled value="">Select team</option>
          <option
            v-for="team in props.teams"
            :key="team.id"
            :value="team.id"
          >
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.teamId" class="field-error">{{ errors.teamId }}</p>
      </div>

      <div class="field-group">
        <label for="imageUrl">Image URL</label>
        <input id="imageUrl" v-model="formState.imageUrl" type="url" />
        <p v-if="errors.imageUrl" class="field-error">{{ errors.imageUrl }}</p>
      </div>

      <div class="field-group">
        <label for="shirtNumber">Shirt Number</label>
        <input id="shirtNumber" v-model.number="formState.shirtNumber" type="number" min="0" />
        <p v-if="errors.shirtNumber" class="field-error">{{ errors.shirtNumber }}</p>
      </div>

      <div class="field-group">
        <label for="matchesPlayed">Matches Played</label>
        <input
          id="matchesPlayed"
          v-model.number="formState.matchesPlayed"
          type="number"
          min="0"
        />
        <p v-if="errors.matchesPlayed" class="field-error">{{ errors.matchesPlayed }}</p>
      </div>

      <div class="field-group">
        <label for="minutesPlayed">Minutes Played</label>
        <input id="minutesPlayed" v-model.number="formState.minutesPlayed" type="number" min="0" />
        <p v-if="errors.minutesPlayed" class="field-error">{{ errors.minutesPlayed }}</p>
      </div>

      <div class="field-group">
        <label for="goals">Goals</label>
        <input id="goals" v-model.number="formState.goals" type="number" min="0" />
        <p v-if="errors.goals" class="field-error">{{ errors.goals }}</p>
      </div>

      <div class="field-group">
        <label for="assists">Assists</label>
        <input id="assists" v-model.number="formState.assists" type="number" min="0" />
        <p v-if="errors.assists" class="field-error">{{ errors.assists }}</p>
      </div>

      <div class="field-group">
        <label for="shots">Shots</label>
        <input id="shots" v-model.number="formState.shots" type="number" min="0" />
        <p v-if="errors.shots" class="field-error">{{ errors.shots }}</p>
      </div>

      <div class="field-group">
        <label for="passes">Passes</label>
        <input id="passes" v-model.number="formState.passes" type="number" min="0" />
        <p v-if="errors.passes" class="field-error">{{ errors.passes }}</p>
      </div>

      <div class="field-group">
        <label for="yellowCards">Yellow Cards</label>
        <input id="yellowCards" v-model.number="formState.yellowCards" type="number" min="0" />
        <p v-if="errors.yellowCards" class="field-error">{{ errors.yellowCards }}</p>
      </div>

      <div class="field-group">
        <label for="redCards">Red Cards</label>
        <input id="redCards" v-model.number="formState.redCards" type="number" min="0" />
        <p v-if="errors.redCards" class="field-error">{{ errors.redCards }}</p>
      </div>

      <div class="field-group field-group--full">
        <button type="submit">{{ actionCopy }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.player-form {
  border-radius: 2rem;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #fff;
  padding: 2rem;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.08);
}

.player-form__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .player-form__header {
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

.player-form__header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.player-form__header p {
  color: #475569;
  margin-top: 0.3rem;
}

.player-form__danger button {
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  transition: background 0.2s ease;
}

.player-form__danger button:hover {
  background: rgba(239, 68, 68, 0.2);
}

.player-form__grid {
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

input,
select {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.65rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f172a;
  background: #fff;
}

input:focus,
select:focus {
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
  transition: transform 0.2s ease;
}

button[type='submit']:hover {
  transform: translateY(-2px);
}
</style>
