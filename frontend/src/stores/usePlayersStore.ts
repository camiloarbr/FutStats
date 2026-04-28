// @author: Camilo | FutStats
// 1. External imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 2. Internal imports
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<PlayerInterface[]>([])

  function setPlayers(newPlayers: PlayerInterface[]): void {
    players.value = newPlayers
  }

  return { players, setPlayers }
})
