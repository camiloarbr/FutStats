// @author: Samuel | FutStats
import { useTeamsStore } from '@/stores/useTeamsStore'
import type { TeamInterface, CreateTeamDTO } from '@/interfaces/TeamInterface'
import type { TeamPerformanceRow } from '@/interfaces/DashboardInterface'

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

  static update(id: number, dto: CreateTeamDTO): TeamInterface | undefined {
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
      team.id === id ? updatedTeam : team,
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
      (team: TeamInterface) => team.id !== id,
    )

    teamsStore.setTeams(filteredTeams)

    return true
  }

  static getTeamPerformance(): TeamPerformanceRow[] {
    const sortedTeams = [...this.getAll()]
      .sort((firstTeam, secondTeam) => secondTeam.goalsFor - firstTeam.goalsFor)
      .slice(0, 6)

    const highestGoals = sortedTeams[0]?.goalsFor ?? 1

    const barClasses: string[] = [
      'bg-[#1b69ff]',
      'bg-[#3d82ff]',
      'bg-[#5b96ff]',
      'bg-[#7baeff]',
      'bg-[#9ac4ff]',
      'bg-[#bfdcff]',
    ]

    return sortedTeams.map((team, index) => {
      const resolvedClass = barClasses[index] ?? 'bg-[#1b69ff]'

      return {
        name: team.name,
        goals: team.goalsFor,
        width: Math.max(12, Math.round((team.goalsFor / highestGoals) * 100)),
        barClass: resolvedClass,
      }
    })
  }
}