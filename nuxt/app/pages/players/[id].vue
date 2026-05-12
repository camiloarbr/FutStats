<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import {
  calculateContributionRate,
  calculateGoalParticipation,
} from '../../domains/players/player.metrics'
import { getPlayerIdFromParam } from '../../domains/players/player-route.utils'
import type { Player } from '../../domains/players/player.types'

const route = useRoute()
const playerId = getPlayerIdFromParam(route.params.id)

if (!Number.isInteger(playerId)) {
  throw createError({
    statusCode: 400,
    statusMessage: 'El id del jugador debe ser numerico.',
  })
}

const { data, error } = await useFetch<Player>(`/api/players/${playerId}`, {
  key: `player-${playerId}`,
})

const fetchError = error.value

if (fetchError !== null && fetchError !== undefined) {
  throw createError({
    statusCode: fetchError.statusCode ?? 500,
    statusMessage:
      fetchError.statusMessage ?? 'No fue posible cargar el jugador.',
  })
}

const player = computed<Player>(() => {
  if (data.value === null || data.value === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Jugador no encontrado.',
    })
  }

  return data.value
})

const directContributions = computed<number>(() =>
  calculateGoalParticipation(player.value),
)
const contributionRate = computed<string>(() =>
  calculateContributionRate(player.value),
)

useHead(() => ({
  title: `${player.value.nombre} | FutStats Players`,
}))
</script>

<template>
  <section class="page-stack">
    <NuxtLink class="text-link" to="/players">Volver a players</NuxtLink>

    <header class="page-hero player-hero">
      <p class="eyebrow">{{ player.posicion }}</p>
      <h1>{{ player.nombre }}</h1>
      <p>{{ player.descripcion }}</p>
      <div class="inline-stats">
        <StatTile label="Equipo" tone="slate" :value="player.equipo" />
        <StatTile
          label="Participacion"
          tone="green"
          :value="directContributions"
        />
        <StatTile label="Por partido" tone="cyan" :value="contributionRate" />
      </div>
    </header>

    <section class="metric-row">
      <StatTile label="Goles" tone="green" :value="player.goles" />
      <StatTile label="Asistencias" tone="cyan" :value="player.asistencias" />
      <StatTile label="Partidos" tone="blue" :value="player.partidosJugados" />
    </section>
  </section>
</template>
