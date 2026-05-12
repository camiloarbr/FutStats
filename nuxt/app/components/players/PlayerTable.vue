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
  <div class="table-wrap">
    <table class="players-table">
      <thead>
        <tr>
          <th>Jugador</th>
          <th>Equipo</th>
          <th>Posicion</th>
          <th>Goles</th>
          <th>Asistencias</th>
          <th>Participacion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id">
          <td>
            <NuxtLink class="player-link" :to="`/players/${player.id}`">
              {{ player.nombre }}
            </NuxtLink>
          </td>
          <td>{{ player.equipo }}</td>
          <td>{{ player.posicion }}</td>
          <td>{{ player.goles }}</td>
          <td>{{ player.asistencias }}</td>
          <td>{{ calculateGoalParticipation(player) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
