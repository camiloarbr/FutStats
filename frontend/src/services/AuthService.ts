// @author: [Name] | FutStats
import { useAuthStore } from '@/stores/useAuthStore'
import type { UserInterface } from '@/interfaces/UserInterface'

export class AuthService {
  static login(email: string, password: string): boolean {
    const authStore = useAuthStore()
    const user = authStore.users.find((item: UserInterface) => {
      return item.email === email && item.passwordHash === password && item.isActive === true
    })

    if (user) {
      authStore.setCurrentUser(user)
      return true
    }

    return false
  }

  static logout(): void {
    const authStore = useAuthStore()
    authStore.setCurrentUser(null)
  }

  static getCurrentUser(): UserInterface | null {
    return useAuthStore().currentUser
  }

  static isAdmin(): boolean {
    return useAuthStore().currentUser?.role === 'admin'
  }
}