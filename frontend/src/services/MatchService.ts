// @author: Samuel | FutStats
// @author: Samuel | FutStats
import { useMatchesStore } from '@/stores/useMatchesStore'
import type { MatchInterface, CreateMatchDTO } from '@/interfaces/MatchInterface'

export class MatchService {
  static getAll(): MatchInterface[] {
    const matchesStore = useMatchesStore()
    return matchesStore.matches
  }

  static getById(id: number): MatchInterface | undefined {
    return this.getAll().find((match: MatchInterface) => match.id === id)
  }

  static getByTeam(teamId: number): MatchInterface[] {
    return this.getAll().filter(
      (match: MatchInterface) => match.homeTeamId === teamId || match.awayTeamId === teamId,
    )
  }

  static create(dto: CreateMatchDTO): MatchInterface {
    const matchesStore = useMatchesStore()

    const nextId =
      matchesStore.matches.length > 0
        ? Math.max(...matchesStore.matches.map((match: MatchInterface) => match.id)) + 1
        : 1

    const newMatch: MatchInterface = {
      id: nextId,
      ...dto,
    }

    matchesStore.setMatches([...matchesStore.matches, newMatch])

    return newMatch
  }

  static update(id: number, dto: CreateMatchDTO): MatchInterface | undefined {
    const matchesStore = useMatchesStore()

    const existingMatch = matchesStore.matches.find((match: MatchInterface) => match.id === id)

    if (!existingMatch) {
      return undefined
    }

    const updatedMatch: MatchInterface = {
      ...existingMatch,
      ...dto,
      id,
    }

    const updatedMatches: MatchInterface[] = matchesStore.matches.map((match: MatchInterface) =>
      match.id === id ? updatedMatch : match,
    )

    matchesStore.setMatches(updatedMatches)

    return updatedMatch
  }

  static delete(id: number): boolean {
    const matchesStore = useMatchesStore()

    const matchExists = matchesStore.matches.some((match: MatchInterface) => match.id === id)

    if (!matchExists) {
      return false
    }

    const filteredMatches: MatchInterface[] = matchesStore.matches.filter(
      (match: MatchInterface) => match.id !== id,
    )

    matchesStore.setMatches(filteredMatches)

    return true
  }
}