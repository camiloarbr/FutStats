// @author: Camilo | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export const usePlayersStore = defineStore('players', () => {
  const players = ref<PlayerInterface[]>(LocalStorageUtils.loadPlayers())

  function setPlayers(newPlayers: PlayerInterface[]): void {
    players.value = newPlayers
    LocalStorageUtils.savePlayers(newPlayers)
  }

  return { players, setPlayers }
})
