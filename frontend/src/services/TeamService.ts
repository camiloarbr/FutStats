// @author: Samuel | FutStats
// 1. External imports

// 2. Internal imports
import type { CreateTeamDTO, UpdateTeamDTO } from '@/dtos/TeamDTO'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { useTeamsStore } from '@/stores/useTeamsStore'

export class TeamService {
  static getAll(): TeamInterface[] {
    const teamsStore = useTeamsStore()
    return teamsStore.teams
  }

  static getById(id: number): TeamInterface | undefined {
    return this.getAll().find((team: TeamInterface) => team.id === id)
  }

  static create(dto: CreateTeamDTO): TeamInterface {
    const teamsStore = useTeamsStore()

    const nextId =
      teamsStore.teams.length > 0
        ? Math.max(...teamsStore.teams.map((team: TeamInterface) => team.id)) + 1
        : 1

    const newTeam: TeamInterface = {
      id: nextId,
      ...dto,
    }

    teamsStore.setTeams([...teamsStore.teams, newTeam])

    return newTeam
  }

  static update(id: number, dto: UpdateTeamDTO): TeamInterface | undefined {
    const teamsStore = useTeamsStore()

    const existingTeam = teamsStore.teams.find((team: TeamInterface) => team.id === id)

    if (!existingTeam) {
      return undefined
    }

    const updatedTeam: TeamInterface = {
      ...existingTeam,
      ...dto,
      id,
    }

    const updatedTeams: TeamInterface[] = teamsStore.teams.map((team: TeamInterface) =>
      team.id === id ? updatedTeam : team
    )

    teamsStore.setTeams(updatedTeams)

    return updatedTeam
  }

  static delete(id: number): boolean {
    const teamsStore = useTeamsStore()

    const teamExists = teamsStore.teams.some((team: TeamInterface) => team.id === id)

    if (!teamExists) {
      return false
    }

    const filteredTeams: TeamInterface[] = teamsStore.teams.filter(
      (team: TeamInterface) => team.id !== id
    )

    teamsStore.setTeams(filteredTeams)

    return true
  }
}
