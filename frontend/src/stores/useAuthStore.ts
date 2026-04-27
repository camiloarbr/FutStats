// @author: Camilo | FutStats
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInterface } from '@/interfaces/UserInterface'

export const useAuthStore = defineStore('auth', () => {
  const users = ref<UserInterface[]>([])
  const currentUser = ref<UserInterface | null>(null)

  const isAuthenticated = computed((): boolean => currentUser.value !== null)

  function setCurrentUser(user: UserInterface | null): void {
    currentUser.value = user
  }

  function setUsers(newUsers: UserInterface[]): void {
    users.value = newUsers
  }

  return { users, currentUser, isAuthenticated, setCurrentUser, setUsers }
})
