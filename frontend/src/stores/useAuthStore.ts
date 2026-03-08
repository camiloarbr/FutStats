// @author: [Name] | FutStats
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInterface } from '@/interfaces/UserInterface'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export const useAuthStore = defineStore('auth', () => {
  const users = ref<UserInterface[]>(LocalStorageUtils.loadUsers())
  const currentUser = ref<UserInterface | null>(null)
  const isAuthenticated = computed((): boolean => currentUser.value !== null)

  function setCurrentUser(user: UserInterface | null): void {
    currentUser.value = user
  }

  return { users, currentUser, isAuthenticated, setCurrentUser }
})
