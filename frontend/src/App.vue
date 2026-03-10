// @author: Camilo | FutStats
<script setup lang="ts">
// Vue reactivity utilities
import { computed } from 'vue'
// Router view rendering
import { RouterView } from 'vue-router'

// Layout components
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
// Auth store accessor
import { useAuthStore } from '@/stores/useAuthStore'

// Authentication state helpers
const authStore = useAuthStore()
const isAuthenticated = computed(() => Boolean(authStore.isAuthenticated))
</script>

<template>
  <div v-if="isAuthenticated" class="flex h-screen overflow-hidden bg-gray-100">
    <AppSidebar />
    <div class="ml-64 flex flex-1 flex-col overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
      <AppFooter />
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-100">
    <RouterView />
  </div>
</template>
