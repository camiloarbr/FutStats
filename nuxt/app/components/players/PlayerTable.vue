<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { calculateGoalParticipation } from '../../domains/players/player.metrics'
import type { Player } from '../../domains/players/player.types'

interface Props {
  players: readonly Player[]
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-md">
    <table class="w-full min-w-[760px] border-collapse">
      <thead>
        <tr>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Jugador</th>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Equipo</th>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Posicion</th>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Goles</th>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Asistencias</th>
          <th class="border-b border-slate-200 bg-slate-100 px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap">Participacion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id" class="hover:bg-slate-50">
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">
            <NuxtLink class="font-extrabold text-blue-700" :to="`/players/${player.slug}`">
              {{ player.nombre }}
            </NuxtLink>
          </td>
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">{{ player.equipo }}</td>
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">{{ player.posicion }}</td>
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">{{ player.goles }}</td>
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">{{ player.asistencias }}</td>
          <td class="border-b border-slate-200 px-4 py-3.5 text-[0.95rem] text-slate-800 whitespace-nowrap">{{ calculateGoalParticipation(player) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
