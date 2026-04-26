// @author: Camilo | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TeamInterface } from '@/interfaces/TeamInterface'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<TeamInterface[]>([])

  function setTeams(newTeams: TeamInterface[]): void {
    teams.value = newTeams
  }

  return { teams, setTeams }
})