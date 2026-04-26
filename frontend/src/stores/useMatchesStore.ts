// @author: Camilo | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MatchInterface } from '@/interfaces/MatchInterface'

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<MatchInterface[]>([])

  function setMatches(newMatches: MatchInterface[]): void {
    matches.value = newMatches
  }

  return { matches, setMatches }
})
