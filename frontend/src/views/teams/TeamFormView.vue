// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Vue reactivity utilities
import { computed, watch } from 'vue'
// Router utilities
import { useRoute, useRouter } from 'vue-router'

// Feature components
import TeamFormCard from '@/components/teams/TeamFormCard.vue'

// Domain services
import { TeamService } from '@/services/TeamService'

// Domain interfaces
import type { CreateTeamDTO, TeamInterface } from '@/interfaces/TeamInterface'

// Router helpers
const route = useRoute()
const router = useRouter()

// Determine mode based on route
const mode = computed<'create' | 'edit'>(() =>
  route.name === 'teams.edit' || route.params.id ? 'edit' : 'create',
)

// Id derived from params for edit operations
const teamId = computed<number>(() => Number(route.params.id))

// Resolve entity from service when editing
const team = computed<TeamInterface | undefined>(() => {
  if (mode.value === 'edit' && Number.isFinite(teamId.value)) {
    return TeamService.getById(teamId.value)
  }
  return undefined
})

// Provide DTO-aligned structure to the form component
const formValues = computed<CreateTeamDTO>(() => buildFormValues(team.value))

// Build DTO defaults for both create/edit
function buildFormValues(source?: TeamInterface): CreateTeamDTO {
  if (source) {
    const { id, ...rest } = source
    void id
    return { ...rest }
  }

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

// Guard against editing missing entities
watch(
  () => ({ isEdit: mode.value === 'edit', team: team.value }),
  ({ isEdit, team: currentTeam }) => {
    if (isEdit && currentTeam === undefined) {
      router.replace({ name: 'teams.index' })
    }
  },
  { immediate: true },
)

// Persist team using the service layer
function handleSubmit(payload: CreateTeamDTO): void {
  if (mode.value === 'create') {
    TeamService.create(payload)
  } else if (teamId.value && !Number.isNaN(teamId.value)) {
    TeamService.update(teamId.value, payload)
  }

  router.push({ name: 'teams.index' })
}

// Remove team when in edit mode
function handleDelete(): void {
  if (mode.value === 'edit' && teamId.value && !Number.isNaN(teamId.value)) {
    TeamService.delete(teamId.value)
  }

  router.push({ name: 'teams.index' })
}
</script>

<template>
  <section class="space-y-6">
    <TeamFormCard
      :mode="mode"
      :initial-values="formValues"
      @submit="handleSubmit"
      @delete="handleDelete"
    />
  </section>
</template>
