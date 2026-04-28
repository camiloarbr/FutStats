// @author: Camilo | FutStats
// 1. External imports
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 2. Internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const currentUser = ref<UserInterface | null>(null)

  const isAuthenticated = computed(
    (): boolean => accessToken.value !== null && currentUser.value !== null
  )

  function clearSession(): void {
    accessToken.value = null
    currentUser.value = null
  }

  function setSession(token: string, user: UserInterface): void {
    accessToken.value = token
    currentUser.value = user
  }

  return { accessToken, currentUser, isAuthenticated, clearSession, setSession }
})
