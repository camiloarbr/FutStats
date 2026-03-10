// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TeamFormCard from '@/components/teams/TeamFormCard.vue'

import { TeamService } from '@/services/TeamService'

import type { CreateTeamDTO, TeamInterface } from '@/interfaces/TeamInterface'

const route = useRoute()
const router = useRouter()

const mode = computed<'create' | 'edit'>(() =>
  route.name === 'teams.edit' || route.params.id ? 'edit' : 'create',
)

const teamId = computed<number>(() => Number(route.params.id))

const team = computed<TeamInterface | undefined>(() => {
  if (mode.value === 'edit' && Number.isFinite(teamId.value)) {
    return TeamService.getById(teamId.value)
  }
  return undefined
})

const formValues = computed<CreateTeamDTO>(() => buildFormValues(team.value))

function buildFormValues(source?: TeamInterface): CreateTeamDTO {
  if (source) {
    const { id: _ignored, ...rest } = source
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

watch(
  () => ({ isEdit: mode.value === 'edit', team: team.value }),
  ({ isEdit, team: currentTeam }) => {
    if (isEdit && currentTeam === undefined) {
      router.replace({ name: 'teams.index' })
    }
  },
  { immediate: true },
)

function handleSubmit(payload: CreateTeamDTO): void {
  if (mode.value === 'create') {
    TeamService.create(payload)
  } else if (teamId.value && !Number.isNaN(teamId.value)) {
    TeamService.update(teamId.value, payload)
  }

  router.push({ name: 'teams.index' })
}

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
