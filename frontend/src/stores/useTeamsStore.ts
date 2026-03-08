// @author: [Name] | FutStats
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<TeamInterface[]>(LocalStorageUtils.loadTeams())

  function setTeams(newTeams: TeamInterface[]): void {
    teams.value = newTeams
    LocalStorageUtils.saveTeams(newTeams)
  }

  return { teams, setTeams }
})