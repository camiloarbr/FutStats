// @author: [Name] | FutStats
<script setup lang="ts">
// Vue reactivity utilities
import { computed } from 'vue'
// Router navigation helpers
import { useRoute, useRouter } from 'vue-router'

// Auth domain services
import { AuthService } from '@/services/AuthService'
// Auth store accessors
import { useAuthStore } from '@/stores/useAuthStore'

// Routing instances and store reference
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Header display copy
const pageTitle = computed(() => route.meta.title)
const username = computed(() => authStore.currentUser?.username ?? 'Guest')

// Session termination handler
function handleLogout(): void {
  AuthService.logout()
  void router.push({ name: 'login' })
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

        <button @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </header>
</template>
