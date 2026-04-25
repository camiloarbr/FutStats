// @author: Camilo | FutStats
import type { StateTree } from 'pinia'
import { Seeders } from '@/utils/Seeders'
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { UserInterface } from '@/interfaces/UserInterface'

export class LocalStorageUtils {
  private static readonly KEY = import.meta.env.VITE_STORAGE_KEY as string
  private static readonly SEEDED_FLAG = `${LocalStorageUtils.KEY}_seeded`
  private static readonly CURRENT_USER_KEY = `${LocalStorageUtils.KEY}_currentUserId`
  private static readonly PINIA_STATE_KEY = `${LocalStorageUtils.KEY}_piniaState`

  private static restoreDateFieldsFromPiniaState(
    state: Record<string, StateTree>,
  ): Record<string, StateTree> {
    const restoredState = state as Record<string, StateTree> & {
      auth?: {
        users?: UserInterface[]
        currentUser?: UserInterface | null
      }
      matches?: {
        matches?: MatchInterface[]
      }
    }

    if (restoredState.matches?.matches !== undefined) {
      restoredState.matches.matches = restoredState.matches.matches.map((match: MatchInterface) => ({
        ...match,
        date: new Date(match.date),
      }))
    }

    if (restoredState.auth?.users !== undefined) {
      restoredState.auth.users = restoredState.auth.users.map((user: UserInterface) => ({
        ...user,
        createdAt: new Date(user.createdAt),
      }))
    }

    if (restoredState.auth?.currentUser !== undefined && restoredState.auth.currentUser !== null) {
      restoredState.auth.currentUser = {
        ...restoredState.auth.currentUser,
        createdAt: new Date(restoredState.auth.currentUser.createdAt),
      }
    }

    return restoredState
  }

  static isSeeded(): boolean {
    return localStorage.getItem(LocalStorageUtils.SEEDED_FLAG) === 'true'
  }

  static markAsSeeded(): void {
    localStorage.setItem(LocalStorageUtils.SEEDED_FLAG, 'true')
  }

  static clear(): void {
    const keysToRemove: string[] = []

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)

      if (key !== null && key.startsWith(LocalStorageUtils.KEY)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key: string) => {
      localStorage.removeItem(key)
    })
  }

  static saveTeams(teams: TeamInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_teams`, JSON.stringify(teams))
  }

  static loadTeams(): TeamInterface[] {
    const rawTeams = localStorage.getItem(`${LocalStorageUtils.KEY}_teams`)

    if (rawTeams === null) {
      return []
    }

    const parsedTeams = JSON.parse(rawTeams) as unknown
    return parsedTeams as TeamInterface[]
  }

  static savePlayers(players: PlayerInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_players`, JSON.stringify(players))
  }

  static loadPlayers(): PlayerInterface[] {
    const rawPlayers = localStorage.getItem(`${LocalStorageUtils.KEY}_players`)

    if (rawPlayers === null) {
      return []
    }

    const parsedPlayers = JSON.parse(rawPlayers) as unknown
    return parsedPlayers as PlayerInterface[]
  }

  static saveMatches(matches: MatchInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_matches`, JSON.stringify(matches))
  }

  static loadMatches(): MatchInterface[] {
    const rawMatches = localStorage.getItem(`${LocalStorageUtils.KEY}_matches`)

    if (rawMatches === null) {
      return []
    }

    const parsedMatches = JSON.parse(rawMatches) as unknown
    const matchesArray = parsedMatches as MatchInterface[]

    return matchesArray.map((match: MatchInterface) => ({
      ...match,
      date: new Date(match.date),
    }))
  }

  static saveUsers(users: UserInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_users`, JSON.stringify(users))
  }

  static loadUsers(): UserInterface[] {
    const rawUsers = localStorage.getItem(`${LocalStorageUtils.KEY}_users`)

    if (rawUsers === null) {
      return []
    }

    const parsedUsers = JSON.parse(rawUsers) as unknown
    const usersArray = parsedUsers as UserInterface[]

    return usersArray.map((user: UserInterface) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }))
  }

  static saveCurrentUserId(userId: number | null): void {
    if (userId === null) {
      localStorage.removeItem(LocalStorageUtils.CURRENT_USER_KEY)
      return
    }

    localStorage.setItem(LocalStorageUtils.CURRENT_USER_KEY, userId.toString())
  }

  static loadCurrentUserId(): number | null {
    const stored = localStorage.getItem(LocalStorageUtils.CURRENT_USER_KEY)

    if (stored === null) {
      return null
    }

    const parsed = Number(stored)
    return Number.isNaN(parsed) ? null : parsed
  }

  static savePiniaState(state: Record<string, StateTree>): void {
    localStorage.setItem(LocalStorageUtils.PINIA_STATE_KEY, JSON.stringify(state))
  }

  static loadPiniaState(): Record<string, StateTree> | null {
    const rawPiniaState = localStorage.getItem(LocalStorageUtils.PINIA_STATE_KEY)

    if (rawPiniaState === null) {
      return null
    }

    const parsedPiniaState = JSON.parse(rawPiniaState) as unknown
    return LocalStorageUtils.restoreDateFieldsFromPiniaState(
      parsedPiniaState as Record<string, StateTree>,
    )
  }

  static seed(): void {
    if (LocalStorageUtils.isSeeded()) {
      return
    }

    Seeders.run()
    LocalStorageUtils.markAsSeeded()
  }
}