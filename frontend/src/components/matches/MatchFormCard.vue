// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Vue reactivity utilities
import { computed, reactive, watch } from 'vue'

// Match form DTO contracts
import type { CreateMatchDTO } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

// Supported component modes
type FormMode = 'create' | 'edit'

// Internal reactive state
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

// Component props
interface Props {
  mode: FormMode
  initialValues: CreateMatchDTO
  teams: TeamInterface[]
}

// Props and emitted events
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', payload: CreateMatchDTO): void
  (e: 'delete'): void
}>()

// Local state and validation errors
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

// Keep local state synced with incoming props
watch(
  () => props.initialValues,
  (nextValues) => {
    Object.assign(formState, buildStateFromDto(nextValues))
    clearErrors()
  },
  { deep: true },
)

// UI copy helpers
const titleCopy = computed(() => (props.mode === 'create' ? 'Register new match' : 'Edit match'))
const actionCopy = computed(() => (props.mode === 'create' ? 'Save match' : 'Update match'))

// Build editable state from DTO
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

// Reset validation messages
function clearErrors(): void {
  (Object.keys(errors) as (keyof typeof errors)[]).forEach((key) => {
    errors[key] = ''
  })
}

// Per-field validation helper
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

// Full-form validation pipeline
function validateForm(): boolean {
  clearErrors()

  (Object.keys(formState) as (keyof MatchFormState)[]).forEach((key) => {
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

// Map internal state back to DTO
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

// Submit handler for parent integration
function handleSubmit(): void {
  if (!validateForm()) {
    errors.general = 'Resolve the highlighted fields before continuing.'
    return
  }

  errors.general = ''
  emit('submit', buildDtoFromState())
}

// Delete handler only used in edit mode
function handleDelete(): void {
  emit('delete')
}
</script>

<template>
  <div class="match-form">
    <div class="match-form__header">
      <div>
        <p class="form-chip">Admin workflow</p>
        <h2>{{ titleCopy }}</h2>
        <p>Manage official results and match stats within a single streamlined flow.</p>
      </div>
      <button
        v-if="props.mode === 'edit'"
        type="button"
        class="danger-chip"
        @click="handleDelete"
      >
        Delete match
      </button>
    </div>

    <form class="match-form__grid" @submit.prevent="handleSubmit">
      <div class="field-group">
        <label for="match-date">Date</label>
        <input id="match-date" v-model="formState.date" type="date" />
        <p v-if="errors.date" class="field-error">{{ errors.date }}</p>
      </div>

      <div class="field-group">
        <label for="stadium">Stadium</label>
        <input id="stadium" v-model="formState.stadium" type="text" />
        <p v-if="errors.stadium" class="field-error">{{ errors.stadium }}</p>
      </div>

      <div class="field-group">
        <label for="homeTeam">Home team</label>
        <select id="homeTeam" v-model.number="formState.homeTeamId">
          <option disabled value="0">Select a team</option>
          <option v-for="team in props.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.homeTeamId" class="field-error">{{ errors.homeTeamId }}</p>
      </div>

      <div class="field-group">
        <label for="awayTeam">Away team</label>
        <select id="awayTeam" v-model.number="formState.awayTeamId">
          <option disabled value="0">Select a team</option>
          <option v-for="team in props.teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </select>
        <p v-if="errors.awayTeamId" class="field-error">{{ errors.awayTeamId }}</p>
      </div>

      <div class="field-group">
        <label for="homeScore">Home goals</label>
        <input id="homeScore" v-model.number="formState.homeScore" type="number" min="0" />
        <p v-if="errors.homeScore" class="field-error">{{ errors.homeScore }}</p>
      </div>

      <div class="field-group">
        <label for="awayScore">Away goals</label>
        <input id="awayScore" v-model.number="formState.awayScore" type="number" min="0" />
        <p v-if="errors.awayScore" class="field-error">{{ errors.awayScore }}</p>
      </div>

      <div class="field-group">
        <label for="possessionHome">Home possession (%)</label>
        <input
          id="possessionHome"
          v-model.number="formState.possessionHome"
          type="number"
          min="0"
          max="100"
        />
        <p v-if="errors.possessionHome" class="field-error">{{ errors.possessionHome }}</p>
      </div>

      <div class="field-group">
        <label for="possessionAway">Away possession (%)</label>
        <input
          id="possessionAway"
          v-model.number="formState.possessionAway"
          type="number"
          min="0"
          max="100"
        />
        <p v-if="errors.possessionAway" class="field-error">{{ errors.possessionAway }}</p>
      </div>

      <div class="field-group">
        <label for="shotsHome">Home shots</label>
        <input id="shotsHome" v-model.number="formState.shotsHome" type="number" min="0" />
        <p v-if="errors.shotsHome" class="field-error">{{ errors.shotsHome }}</p>
      </div>

      <div class="field-group">
        <label for="shotsAway">Away shots</label>
        <input id="shotsAway" v-model.number="formState.shotsAway" type="number" min="0" />
        <p v-if="errors.shotsAway" class="field-error">{{ errors.shotsAway }}</p>
      </div>

      <div class="field-group">
        <label for="foulsHome">Home fouls</label>
        <input id="foulsHome" v-model.number="formState.foulsHome" type="number" min="0" />
        <p v-if="errors.foulsHome" class="field-error">{{ errors.foulsHome }}</p>
      </div>

      <div class="field-group">
        <label for="foulsAway">Away fouls</label>
        <input id="foulsAway" v-model.number="formState.foulsAway" type="number" min="0" />
        <p v-if="errors.foulsAway" class="field-error">{{ errors.foulsAway }}</p>
      </div>

      <div class="field-group field-group--full">
        <button type="submit">{{ actionCopy }}</button>
        <p v-if="errors.general" class="field-error">{{ errors.general }}</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.match-form {
  border-radius: 2rem;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #fff;
  padding: 2rem;
  box-shadow: 0 40px 90px rgba(15, 23, 42, 0.08);
}

.match-form__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .match-form__header {
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

.match-form__header h2 {
  margin-top: 0.4rem;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.match-form__header p {
  color: #475569;
}

.danger-chip {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1rem;
}

.match-form__grid {
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

button[type='submit'] {
  border-radius: 999px;
  background: linear-gradient(120deg, #1d4ed8, #22d3ee);
  color: #fff;
  font-weight: 700;
  padding: 0.85rem 1.5rem;
  border: none;
  box-shadow: 0 25px 60px rgba(37, 99, 235, 0.25);
}

.field-error {
  font-size: 0.75rem;
  color: #dc2626;
}
</style>
