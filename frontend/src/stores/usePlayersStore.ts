// @author: Camilo | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<PlayerInterface[]>([])

  function setPlayers(newPlayers: PlayerInterface[]): void {
    players.value = newPlayers
  }

  return { players, setPlayers }
})
