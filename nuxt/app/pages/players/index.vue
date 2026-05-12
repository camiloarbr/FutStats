<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { sortPlayersByGoalParticipation } from '../../domains/players/player.metrics'
import type { Player } from '../../domains/players/player.types'

// 3. Data
const { data, error } = await useFetch<readonly Player[]>('/api/players', {
  key: 'players-index',
})

if (error.value !== null && error.value !== undefined) {
  throw createError({
    statusCode: 500,
    statusMessage: 'No fue posible cargar los jugadores.',
  })
}

// 4. Derived state
const players = computed<readonly Player[]>(() => data.value ?? [])
const sortedPlayers = computed<Player[]>(() => sortPlayersByGoalParticipation(players.value))
const totalGoals = computed<number>(() => players.value.reduce((sum, p) => sum + p.goles, 0))
const totalAssists = computed<number>(() => players.value.reduce((sum, p) => sum + p.asistencias, 0))

useHead({ title: 'Players SSR | FutStats Nuxt' })
</script>

<template>
  <section class="grid gap-6">
    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">Players SSR</p>
      <h1 class="my-3 max-w-[16ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">Rendimiento de jugadores</h1>
      <p class="m-0 max-w-[46rem] text-white/80">
        Datos consultados desde la capa server de Nuxt para listar futbolistas, goles, asistencias y participacion directa.
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <StatTile label="Jugadores" tone="blue" :value="players.length" />
        <StatTile label="Goles" tone="green" :value="totalGoals" />
        <StatTile label="Asistencias" tone="cyan" :value="totalAssists" />
      </div>
    </header>

    <PlayerTable :players="sortedPlayers" />
  </section>
</template>
