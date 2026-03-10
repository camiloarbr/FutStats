// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import MatchFormCard from '@/components/matches/MatchFormCard.vue'

import { MatchService } from '@/services/MatchService'
import { TeamService } from '@/services/TeamService'

import type { CreateMatchDTO } from '@/interfaces/MatchInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

const router = useRouter()

const teams = computed<TeamInterface[]>(() => TeamService.getAll())
const feedback = ref<'idle' | 'success' | 'error'>('idle')

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

const initialValues = computed<CreateMatchDTO>(() => buildDefaultMatch())

function handleMatchSubmit(payload: CreateMatchDTO): void {
  try {
    MatchService.create(payload)
    feedback.value = 'success'
  } catch (error) {
    console.error(error)
    feedback.value = 'error'
  }
}

function goToMatches(): void {
  router.push({ name: 'matches.index' })
}
</script>

<template>
  <section class="space-y-8">
    <header class="admin-hero">
      <div>
        <p class="hero-chip">Admin Center</p>
        <h1>Panel de control</h1>
        <p>
          Gestiona los datos clave de FutStats desde una sola vista. Agrega nuevos partidos y muy
          pronto más entidades.
        </p>
      </div>
      <button type="button" class="hero-action" @click="goToMatches">Ver partidos</button>
    </header>

    <div v-if="teams.length < 2" class="warning">
      Necesitas al menos dos equipos registrados para crear un partido. Ve a la vista de teams y
      agrega los que falten.
    </div>

    <MatchFormCard
      v-else
      mode="create"
      :initial-values="initialValues"
      :teams="teams"
      @submit="handleMatchSubmit"
    />

    <p v-if="feedback === 'success'" class="success-banner">
      Partido guardado correctamente. Puedes verlo en la vista de Matches.
    </p>
    <p v-else-if="feedback === 'error'" class="error-banner">
      Ocurrió un error al guardar. Intenta nuevamente.
    </p>
  </section>
</template>

<style scoped>
.admin-hero {
  border-radius: 1.75rem;
  background: linear-gradient(120deg, #0f172a, #1d4ed8, #22d3ee);
  padding: 2rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

@media (min-width: 768px) {
  .admin-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-chip {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.admin-hero h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
}

.admin-hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 32rem;
}

.hero-action {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.hero-action:hover {
  background: rgba(255, 255, 255, 0.2);
}

.warning {
  border-radius: 1.25rem;
  border: 1px dashed rgba(245, 158, 11, 0.6);
  background: rgba(251, 191, 36, 0.2);
  color: #92400e;
  padding: 1rem 1.25rem;
}

.success-banner,
.error-banner {
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-weight: 600;
  text-align: center;
}

.success-banner {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.error-banner {
  background: rgba(248, 113, 113, 0.1);
  color: #b91c1c;
}
</style>
