// @author: Samuel | FutStats
// 1. External imports

// 2. Internal imports
import type { CreateMatchDTO, UpdateMatchDTO } from '@/dtos/MatchDTO'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import { apiClient } from '@/services/ApiClient'
import { useMatchesStore } from '@/stores/useMatchesStore'

interface DeleteResponse {
  deleted: boolean
}

export class MatchService {
  static async loadAll(): Promise<MatchInterface[]> {
    const response = await apiClient.get<MatchInterface[]>('/matches')
    const matches = response.data.map((match) => MatchService.normalizeMatch(match))
    const matchesStore = useMatchesStore()
    matchesStore.setMatches(matches)
    return matches
  }

  static getAll(): MatchInterface[] {
    const matchesStore = useMatchesStore()
    return matchesStore.matches
  }

  static getById(id: number): MatchInterface | undefined {
    return this.getAll().find((match: MatchInterface) => match.id === id)
  }

  static getByTeam(teamId: number): MatchInterface[] {
    return this.getAll().filter(
      (match: MatchInterface) => match.homeTeamId === teamId || match.awayTeamId === teamId
    )
  }

  static async create(dto: CreateMatchDTO): Promise<MatchInterface> {
    const matchesStore = useMatchesStore()
    const response = await apiClient.post<MatchInterface>('/matches', dto)
    const newMatch = MatchService.normalizeMatch(response.data)
    matchesStore.setMatches([...matchesStore.matches, newMatch])
    return newMatch
  }

  static async update(id: number, dto: UpdateMatchDTO): Promise<MatchInterface | undefined> {
    const matchesStore = useMatchesStore()
    const response = await apiClient.patch<MatchInterface>(`/matches/${id}`, dto)
    const updatedMatch = MatchService.normalizeMatch(response.data)
    const updatedMatches: MatchInterface[] = matchesStore.matches.map((match: MatchInterface) =>
      match.id === id ? updatedMatch : match
    )

    matchesStore.setMatches(updatedMatches)

    return updatedMatch
  }

  static async delete(id: number): Promise<boolean> {
    const matchesStore = useMatchesStore()
    const response = await apiClient.delete<DeleteResponse>(`/matches/${id}`)
    const filteredMatches: MatchInterface[] = matchesStore.matches.filter(
      (match: MatchInterface) => match.id !== id
    )

    matchesStore.setMatches(filteredMatches)
    return response.data.deleted
  }

  private static normalizeMatch(match: MatchInterface): MatchInterface {
    return {
      ...match,
      date: new Date(match.date),
    }
  }
}
