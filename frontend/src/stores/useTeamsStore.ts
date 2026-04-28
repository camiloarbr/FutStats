// @author: Camilo | FutStats
// 1. External imports
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 2. Internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<TeamInterface[]>([])

  function setTeams(newTeams: TeamInterface[]): void {
    teams.value = newTeams
  }

  return { teams, setTeams }
})
