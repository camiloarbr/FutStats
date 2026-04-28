// @author: Samuel | FutStats
// 1. External imports

// 2. Internal imports
import type { CreateTeamDTO, UpdateTeamDTO } from '@/dtos/TeamDTO'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { apiClient } from '@/services/ApiClient'
import { MatchService } from '@/services/MatchService'
import { PlayerService } from '@/services/PlayerService'
import { useTeamsStore } from '@/stores/useTeamsStore'

interface DeleteResponse {
  deleted: boolean
}

export class TeamService {
  static async loadAll(): Promise<TeamInterface[]> {
    const response = await apiClient.get<TeamInterface[]>('/teams')
    const teamsStore = useTeamsStore()
    teamsStore.setTeams(response.data)
    return response.data
  }

  static getAll(): TeamInterface[] {
    const teamsStore = useTeamsStore()
    return teamsStore.teams
  }

  static getById(id: number): TeamInterface | undefined {
    return this.getAll().find((team: TeamInterface) => team.id === id)
  }

  static async create(dto: CreateTeamDTO): Promise<TeamInterface> {
    const teamsStore = useTeamsStore()
    const response = await apiClient.post<TeamInterface>('/teams', dto)
    const newTeam = response.data
    teamsStore.setTeams([...teamsStore.teams, newTeam])
    return newTeam
  }

  static async update(id: number, dto: UpdateTeamDTO): Promise<TeamInterface | undefined> {
    const teamsStore = useTeamsStore()
    const response = await apiClient.patch<TeamInterface>(`/teams/${id}`, dto)
    const updatedTeam = response.data
    const updatedTeams: TeamInterface[] = teamsStore.teams.map((team: TeamInterface) =>
      team.id === id ? updatedTeam : team
    )

    teamsStore.setTeams(updatedTeams)

    return updatedTeam
  }

  static async delete(id: number): Promise<boolean> {
    const teamsStore = useTeamsStore()
    const response = await apiClient.delete<DeleteResponse>(`/teams/${id}`)
    const filteredTeams: TeamInterface[] = teamsStore.teams.filter(
      (team: TeamInterface) => team.id !== id
    )

    teamsStore.setTeams(filteredTeams)
    await Promise.all([PlayerService.loadAll(), MatchService.loadAll()])
    return response.data.deleted
  }
}
