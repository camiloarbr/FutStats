<script setup lang="ts">
// @author: [Name] | FutStats
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { AuthService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => route.meta.title)
const username = computed(() => authStore.currentUser?.username ?? 'Guest')
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

        <button @click="AuthService.logout()">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </header>
</template>
