// @author: Samuel | FutStats
import { usePlayersStore } from '@/stores/usePlayersStore'
import { TeamService } from '@/services/TeamService'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TopScorerRow } from '@/interfaces/DashboardInterface'

export class PlayerService {
  static getAll(): PlayerInterface[] {
    const playersStore = usePlayersStore()
    return playersStore.players
  }

  static getByTeam(teamId: number): PlayerInterface[] {
    return this.getAll().filter((player: PlayerInterface) => player.teamId === teamId)
  }

  static getTopScorers(): TopScorerRow[] {
    const teams = TeamService.getAll()

    return [...this.getAll()]
      .sort((firstPlayer, secondPlayer) => secondPlayer.goals - firstPlayer.goals)
      .slice(0, 5)
      .map((player, index) => {
        const team = teams.find((currentTeam) => currentTeam.id === player.teamId)

        return {
          initials: this.buildInitials(player.fullName),
          initialsClass: this.resolveInitialsClass(index),
          name: player.fullName,
          team: team?.name ?? 'Unknown Team',
          goals: player.goals,
          assists: player.assists,
        }
      })
  }

  private static buildInitials(fullName: string): string {
    const words: string[] = fullName
      .trim()
      .split(' ')
      .filter((word: string) => word.length > 0)

    if (words.length === 0) {
      return 'NA'
    }

    const firstWord = words[0]
    if (!firstWord) {
      return 'NA'
    }

    if (words.length === 1) {
      return firstWord.slice(0, 2).toUpperCase()
    }

    const secondWord = words[1]
    if (!secondWord) {
      return firstWord.slice(0, 2).toUpperCase()
    }

    return `${firstWord[0]}${secondWord[0]}`.toUpperCase()
  }

  private static resolveInitialsClass(index: number): string {
    const classes: string[] = [
      'bg-blue-100 text-[#1b69ff]',
      'bg-red-100 text-red-600',
      'bg-slate-100 text-slate-600',
      'bg-indigo-100 text-indigo-600',
      'bg-rose-50 text-rose-500',
    ]

    const resolvedClass = classes[index % classes.length]
    return resolvedClass ?? 'bg-slate-100 text-slate-600'
  }
}