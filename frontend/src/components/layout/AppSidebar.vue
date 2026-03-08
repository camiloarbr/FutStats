<script setup lang="ts">
// @author: [Name] | FutStats
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser ?? null)
const isAuthenticated = computed(() => {
  return Boolean(authStore.isAuthenticated ?? currentUser.value)
})
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const displayUsername = computed(() => currentUser.value?.username ?? 'Guest User')
const displayEmail = computed(() => currentUser.value?.email ?? 'guest@futstats.app')
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gray-800 text-white">
    <div class="border-b border-gray-700 px-6 py-5">
      <h1 class="text-xl font-bold">FutStats</h1>
    </div>

    <nav v-if="isAuthenticated" class="flex-1 space-y-2 px-4 py-6">
      <RouterLink
        :to="{ name: 'home' }"
        active-class="bg-gray-700"
        class="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition hover:bg-gray-700"
      >
        <i class="fa-solid fa-home w-4" aria-hidden="true"></i>
        <span>Home</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'players.index' }"
        active-class="bg-gray-700"
        class="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition hover:bg-gray-700"
      >
        <i class="fa-solid fa-users w-4" aria-hidden="true"></i>
        <span>Players</span>
      </RouterLink>

      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'teams.index' }"
        active-class="bg-gray-700"
        class="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition hover:bg-gray-700"
      >
        <i class="fa-solid fa-shield-halved w-4" aria-hidden="true"></i>
        <span>Teams</span>
      </RouterLink>

      <RouterLink
        v-if="isAdmin"
        :to="{ name: 'matches.index' }"
        active-class="bg-gray-700"
        class="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition hover:bg-gray-700"
      >
        <i class="fa-solid fa-futbol w-4" aria-hidden="true"></i>
        <span>Matches</span>
      </RouterLink>
    </nav>

    <div class="mt-auto border-t border-gray-700 px-4 py-4">
      <div class="flex items-center gap-3 rounded-md bg-gray-700 px-3 py-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600">
          <i class="fa-solid fa-user text-sm" aria-hidden="true"></i>
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold">{{ displayUsername }}</p>
          <p class="truncate text-xs text-gray-300">{{ displayEmail }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
