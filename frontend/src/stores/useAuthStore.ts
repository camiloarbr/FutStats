// @author: Camilo | FutStats
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInterface } from '@/interfaces/UserInterface'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export const useAuthStore = defineStore('auth', () => {
  const users = ref<UserInterface[]>(LocalStorageUtils.loadUsers())
  const currentUser = ref<UserInterface | null>(null)
  const savedUserId = LocalStorageUtils.loadCurrentUserId()

  if (savedUserId !== null) {
    currentUser.value = users.value.find((user: UserInterface) => user.id === savedUserId) ?? null
  }
  const isAuthenticated = computed((): boolean => currentUser.value !== null)

  function setCurrentUser(user: UserInterface | null): void {
    currentUser.value = user
    LocalStorageUtils.saveCurrentUserId(user?.id ?? null)
  }

  return { users, currentUser, isAuthenticated, setCurrentUser }
})
