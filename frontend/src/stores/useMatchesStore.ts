// @author: [Name] | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<MatchInterface[]>(LocalStorageUtils.loadMatches())

  function setMatches(newMatches: MatchInterface[]): void {
    matches.value = newMatches
    LocalStorageUtils.saveMatches(newMatches)
  }

  return { matches, setMatches }
})
