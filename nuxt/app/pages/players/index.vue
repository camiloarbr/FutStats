<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { sortPlayersByGoalParticipation } from '../../domains/players/player.metrics'
import type { Player } from '../../domains/players/player.types'

const { data, error } = await useFetch<readonly Player[]>('/api/players', {
  key: 'players-index',
})

const fetchError = error.value

if (fetchError !== null && fetchError !== undefined) {
  throw createError({
    statusCode: 500,
    statusMessage: 'No fue posible cargar los jugadores.',
  })
}

const players = computed<readonly Player[]>(() => data.value ?? [])
const sortedPlayers = computed<Player[]>(() =>
  sortPlayersByGoalParticipation(players.value),
)
const totalGoals = computed<number>(() =>
  players.value.reduce((total, player) => total + player.goles, 0),
)
const totalAssists = computed<number>(() =>
  players.value.reduce((total, player) => total + player.asistencias, 0),
)

useHead({
  title: 'Players SSR | FutStats Nuxt',
})
</script>

<template>
  <section class="page-stack">
    <header class="page-hero">
      <p class="eyebrow">Players SSR</p>
      <h1>Rendimiento de jugadores</h1>
      <p>
        Datos consultados desde la capa server de Nuxt para listar futbolistas,
        goles, asistencias y participacion directa.
      </p>
      <div class="inline-stats">
        <StatTile label="Jugadores" tone="blue" :value="players.length" />
        <StatTile label="Goles" tone="green" :value="totalGoals" />
        <StatTile label="Asistencias" tone="cyan" :value="totalAssists" />
      </div>
    </header>

    <PlayerTable :players="sortedPlayers" />
  </section>
</template>
