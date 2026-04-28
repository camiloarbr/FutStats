// @author: Camilo | FutStats
// 1. External imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 2. Internal imports
import type { MatchInterface } from '@/interfaces/MatchInterface'

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<MatchInterface[]>([])

  function setMatches(newMatches: MatchInterface[]): void {
    matches.value = newMatches
  }

  return { matches, setMatches }
})
