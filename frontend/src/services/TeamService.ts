// @author: Samuel | FutStats
import { useTeamsStore } from '@/stores/useTeamsStore'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { TeamPerformanceRow } from '@/interfaces/DashboardInterface'

export class TeamService {
  static getAll(): TeamInterface[] {
    const teamsStore = useTeamsStore()
    return teamsStore.teams
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