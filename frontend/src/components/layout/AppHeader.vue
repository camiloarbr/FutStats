<script setup lang="ts">
// @author: [Name] | FutStats
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/useAuthStore'
// TODO: US-09 — implement logout when AuthService is ready
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AuthService from '@/services/AuthService'
const route = useRoute()
const authStore = useAuthStore()
const authServiceModulePath = '@/services/AuthService'

const pageTitle = computed(() => route.meta.title)
const username = computed(() => authStore.currentUser?.username ?? 'Guest')

type AuthServiceContract = {
  logout: () => void | Promise<void>
}

type AuthServiceModule = {
  default?: AuthServiceContract
  AuthService?: AuthServiceContract
}

const handleLogout = async (): Promise<void> => {
  // TODO: Replace dynamic import fallback once AuthService is fully implemented.
  try {
    const module = (await import(/* @vite-ignore */ authServiceModulePath)) as AuthServiceModule
    const resolvedAuthService = module.default ?? module.AuthService

    if (resolvedAuthService) {
      await resolvedAuthService.logout()
    }
  } catch {
    // AuthService is not available yet.
  }
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="flex items-center justify-between px-6 py-4">
      <h2 class="text-2xl font-semibold text-gray-800">{{ pageTitle }}</h2>

      <div class="flex items-center gap-4">
        <button
          type="button"
          class="rounded-md bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
          aria-label="Search"
        >
          <i class="fa-solid fa-search" aria-hidden="true"></i>
        </button>

        <div class="flex items-center gap-2 text-gray-700">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <i class="fa-solid fa-user" aria-hidden="true"></i>
          </span>
          <span class="text-sm font-medium">{{ username }}</span>
        </div>

        <button
          type="button"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
