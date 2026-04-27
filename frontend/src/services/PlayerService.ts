// @author: Victor Chavez | FutStats
import { usePlayersStore } from '@/stores/usePlayersStore'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { CreatePlayerDTO, UpdatePlayerDTO } from '@/interfaces/PlayerDTO'

export class PlayerService {
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

  static create(dto: CreatePlayerDTO): PlayerInterface {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players

    const nextId =
      currentPlayers.length > 0
        ? Math.max(...currentPlayers.map((player: PlayerInterface) => player.id)) + 1
        : 1

    const newPlayer: PlayerInterface = {
      id: nextId,
      ...dto,
    }

    playersStore.setPlayers([...currentPlayers, newPlayer])
    return newPlayer
  }

  static update(id: number, dto: UpdatePlayerDTO): PlayerInterface | undefined {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players
    const existingPlayer = currentPlayers.find((player: PlayerInterface) => player.id === id)

    if (!existingPlayer) {
      return undefined
    }

    const updatedPlayer: PlayerInterface = {
      ...existingPlayer,
      ...dto,
      id,
    }

    const nextPlayers = currentPlayers.map((player: PlayerInterface) =>
      player.id === id ? updatedPlayer : player
    )

    playersStore.setPlayers(nextPlayers)
    return updatedPlayer
  }

  static delete(id: number): boolean {
    const playersStore = usePlayersStore()
    const currentPlayers = playersStore.players
    const exists = currentPlayers.some((player: PlayerInterface) => player.id === id)

    if (!exists) {
      return false
    }

    const nextPlayers = currentPlayers.filter((player: PlayerInterface) => player.id !== id)
    playersStore.setPlayers(nextPlayers)
    return true
  }
}
