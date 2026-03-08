// @author: [Name] | FutStats
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface AuthUser {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  isActive: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => currentUser.value !== null)

  return {
    currentUser,
    isAuthenticated,
  }
})
