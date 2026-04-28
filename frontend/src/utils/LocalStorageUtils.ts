// @author: Camilo | FutStats
// 1. External imports
import type { StateTree } from 'pinia'

// 2. Internal imports
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import { Seeders } from '@/utils/Seeders'

export class LocalStorageUtils {
  private static readonly KEY = import.meta.env.VITE_STORAGE_KEY as string
  private static readonly SEEDED_FLAG = `${LocalStorageUtils.KEY}_seeded`
  private static readonly CURRENT_USER_KEY = `${LocalStorageUtils.KEY}_currentUserId`
  private static readonly PINIA_STATE_KEY = `${LocalStorageUtils.KEY}_piniaState`

  private static restoreDateFieldsFromPiniaState(
    state: Record<string, StateTree>
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
      restoredState.matches.matches = restoredState.matches.matches.map(
        (match: MatchInterface) => ({
          ...match,
          date: new Date(match.date),
        })
      )
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
      parsedPiniaState as Record<string, StateTree>
    )
  }

  static loadLegacyState(): Record<string, StateTree> | null {
    const rawTeams = localStorage.getItem(`${LocalStorageUtils.KEY}_teams`)
    const rawPlayers = localStorage.getItem(`${LocalStorageUtils.KEY}_players`)
    const rawMatches = localStorage.getItem(`${LocalStorageUtils.KEY}_matches`)
    const rawUsers = localStorage.getItem(`${LocalStorageUtils.KEY}_users`)
    const rawCurrentUserId = localStorage.getItem(LocalStorageUtils.CURRENT_USER_KEY)

    const legacyTeams = rawTeams === null ? [] : (JSON.parse(rawTeams) as TeamInterface[])
    const legacyPlayers = rawPlayers === null ? [] : (JSON.parse(rawPlayers) as PlayerInterface[])
    const legacyMatchesRaw = rawMatches === null ? [] : (JSON.parse(rawMatches) as MatchInterface[])
    const legacyUsersRaw = rawUsers === null ? [] : (JSON.parse(rawUsers) as UserInterface[])

    const legacyMatches = legacyMatchesRaw.map((match: MatchInterface) => ({
      ...match,
      date: new Date(match.date),
    }))

    const legacyUsers = legacyUsersRaw.map((user: UserInterface) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }))

    const legacyCurrentUserId =
      rawCurrentUserId === null
        ? null
        : Number.isNaN(Number(rawCurrentUserId))
          ? null
          : Number(rawCurrentUserId)

    const hasLegacyData =
      legacyTeams.length > 0 ||
      legacyPlayers.length > 0 ||
      legacyMatches.length > 0 ||
      legacyUsers.length > 0 ||
      legacyCurrentUserId !== null

    if (!hasLegacyData) {
      return null
    }

    const legacyState: Record<string, StateTree> = {
      teams: { teams: legacyTeams } as StateTree,
      players: { players: legacyPlayers } as StateTree,
      matches: { matches: legacyMatches } as StateTree,
      auth: {
        users: legacyUsers,
        currentUser: legacyCurrentUserId
          ? (legacyUsers.find((u: UserInterface) => u.id === legacyCurrentUserId) ?? null)
          : null,
        isAuthenticated: legacyCurrentUserId !== null,
      } as StateTree,
    }

    return legacyState
  }

  static seed(): void {
    if (LocalStorageUtils.isSeeded()) {
      return
    }

    Seeders.run()
    LocalStorageUtils.markAsSeeded()
  }
}
