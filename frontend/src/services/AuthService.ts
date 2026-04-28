// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { apiClient } from '@/services/ApiClient'
import { useAuthStore } from '@/stores/useAuthStore'
import { AuthStorage } from '@/utils/AuthStorage'

interface LoginResponse {
  accessToken: string
  user: UserInterface
}

export class AuthService {
  static async login(email: string, password: string): Promise<boolean> {
    const authStore = useAuthStore()

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', { email, password })
      const user = {
        ...response.data.user,
        createdAt: new Date(response.data.user.createdAt),
      }

      AuthStorage.saveSession(response.data.accessToken, user)
      authStore.setSession(response.data.accessToken, user)
      return true
    } catch {
      authStore.clearSession()
      AuthStorage.clearSession()
      return false
    }
  }

  static logout(): void {
    const authStore = useAuthStore()
    authStore.clearSession()
    AuthStorage.clearSession()
  }

  static restoreSession(): void {
    const session = AuthStorage.loadSession()

    if (session === null) {
      return
    }

    useAuthStore().setSession(session.accessToken, session.user)
  }

  static getCurrentUser(): UserInterface | null {
    return useAuthStore().currentUser
  }

  static isAdmin(): boolean {
    return useAuthStore().currentUser?.role === 'admin'
  }
}
