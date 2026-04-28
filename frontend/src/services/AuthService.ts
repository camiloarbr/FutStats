// @author: Camilo | FutStats
// 1. External imports
import axios from 'axios'

// 2. Internal imports
import type { UserInterface } from '@/interfaces/UserInterface'
import { apiClient } from '@/services/ApiClient'
import { useAuthStore } from '@/stores/useAuthStore'
import { AuthStorage } from '@/utils/AuthStorage'

interface AuthResponse {
  accessToken: string
  user: UserInterface
}

export class AuthService {
  static async login(email: string, password: string): Promise<boolean> {
    const authStore = useAuthStore()

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password })
      AuthService.persistSession(response.data)
      return true
    } catch {
      authStore.clearSession()
      AuthStorage.clearSession()
      return false
    }
  }

  static async register(username: string, email: string, password: string): Promise<void> {
    const authStore = useAuthStore()

    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
      })
      AuthService.persistSession(response.data)
    } catch (error: unknown) {
      authStore.clearSession()
      AuthStorage.clearSession()

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const message = error.response.data.message as string
        throw new Error(Array.isArray(message) ? message.join(', ') : message)
      }

      throw new Error('Registration failed. Please try again.')
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

  private static persistSession(data: AuthResponse): void {
    const user = {
      ...data.user,
      createdAt: new Date(data.user.createdAt),
    }
    AuthStorage.saveSession(data.accessToken, user)
    useAuthStore().setSession(data.accessToken, user)
  }
}
