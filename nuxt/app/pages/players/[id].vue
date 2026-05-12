<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import {
  calculateContributionRate,
  calculateGoalParticipation,
} from '../../domains/players/player.metrics'
import { getPlayerIdFromParam } from '../../domains/players/player-route.utils'
import type { Player } from '../../domains/players/player.types'

// 3. Route & data
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

if (error.value !== null && error.value !== undefined) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusMessage ?? 'No fue posible cargar el jugador.',
  })
}

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Jugador no encontrado.' })
}

const player = data.value

// 4. Derived state
const directContributions = calculateGoalParticipation(player)
const contributionRate = calculateContributionRate(player).toFixed(2)

useHead(() => ({ title: `${player.nombre} | FutStats Players` }))
</script>

<template>
  <section class="grid gap-6">
    <NuxtLink
      class="w-fit text-[0.78rem] font-black uppercase tracking-wider text-blue-700"
      to="/players"
    >Volver a players</NuxtLink>

    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">{{ player.posicion }}</p>
      <h1 class="my-3 max-w-[18ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">{{ player.nombre }}</h1>
      <p class="m-0 text-white/80">{{ player.descripcion }}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <StatTile label="Equipo" tone="slate" :value="player.equipo" />
        <StatTile label="Participacion" tone="green" :value="directContributions" />
        <StatTile label="Por partido" tone="cyan" :value="contributionRate" />
      </div>
    </header>

    <section class="flex flex-wrap gap-3">
      <StatTile label="Goles" tone="green" :value="player.goles" />
      <StatTile label="Asistencias" tone="cyan" :value="player.asistencias" />
      <StatTile label="Partidos" tone="blue" :value="player.partidosJugados" />
    </section>
  </section>
</template>
