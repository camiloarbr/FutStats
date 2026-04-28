// @author: Victor Chavez | FutStats
// 1. External imports

// 2. Internal imports
import type { CreatePlayerDTO, UpdatePlayerDTO } from '@/dtos/PlayerDTO'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import { apiClient } from '@/services/ApiClient'
import { usePlayersStore } from '@/stores/usePlayersStore'

interface DeleteResponse {
  deleted: boolean
}

export class PlayerService {
  static async loadAll(): Promise<PlayerInterface[]> {
    const response = await apiClient.get<PlayerInterface[]>('/players')
    const playersStore = usePlayersStore()
    playersStore.setPlayers(response.data)
    return response.data
  }

  static getAll(): PlayerInterface[] {
    const playersStore = usePlayersStore()
    return playersStore.players
  }

  static getById(id: number): PlayerInterface | undefined {
    return this.getAll().find((player: PlayerInterface) => player.id === id)
  }

  static getByTeam(teamId: number): PlayerInterface[] {
    return this.getAll().filter((player: PlayerInterface) => player.teamId === teamId)
  }

  static getTopScorers(limit: number = 5): PlayerInterface[] {
    return [...this.getAll()]
      .sort((firstPlayer, secondPlayer) => secondPlayer.goals - firstPlayer.goals)
      .slice(0, limit)
  }

  static async create(dto: CreatePlayerDTO): Promise<PlayerInterface> {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players
    const response = await apiClient.post<PlayerInterface>('/players', dto)
    const newPlayer = response.data
    playersStore.setPlayers([...currentPlayers, newPlayer])
    return newPlayer
  }

  static async update(id: number, dto: UpdatePlayerDTO): Promise<PlayerInterface | undefined> {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players
    const response = await apiClient.patch<PlayerInterface>(`/players/${id}`, dto)
    const updatedPlayer = response.data
    const nextPlayers = currentPlayers.map((player: PlayerInterface) =>
      player.id === id ? updatedPlayer : player
    )

    playersStore.setPlayers(nextPlayers)
    return updatedPlayer
  }

  static async delete(id: number): Promise<boolean> {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players
    const response = await apiClient.delete<DeleteResponse>(`/players/${id}`)
    const nextPlayers = currentPlayers.filter((player: PlayerInterface) => player.id !== id)
    playersStore.setPlayers(nextPlayers)
    return response.data.deleted
  }
}
