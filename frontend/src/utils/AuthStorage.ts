// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

interface StoredSession {
  accessToken: string
  user: UserInterface
}

export class AuthStorage {
  private static readonly TOKEN_KEY = 'futstats_access_token'
  private static readonly USER_KEY = 'futstats_current_user'

  static clearSession(): void {
    localStorage.removeItem(AuthStorage.TOKEN_KEY)
    localStorage.removeItem(AuthStorage.USER_KEY)
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(AuthStorage.TOKEN_KEY)
  }

  static loadSession(): StoredSession | null {
    const accessToken = localStorage.getItem(AuthStorage.TOKEN_KEY)
    const rawUser = localStorage.getItem(AuthStorage.USER_KEY)

    if (accessToken === null || rawUser === null) {
      return null
    }

    const parsedUser = JSON.parse(rawUser) as UserInterface

    return {
      accessToken,
      user: {
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt),
      },
    }
  }

  static saveSession(accessToken: string, user: UserInterface): void {
    localStorage.setItem(AuthStorage.TOKEN_KEY, accessToken)
    localStorage.setItem(AuthStorage.USER_KEY, JSON.stringify(user))
  }
}
