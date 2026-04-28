// @author: Camilo | FutStats
// 1. External imports
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 2. Internal imports

export const useDataStatusStore = defineStore('dataStatus', () => {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const hasLoaded = ref<boolean>(false)

  const hasError = computed((): boolean => errorMessage.value !== null)

  function startLoading(): void {
    isLoading.value = true
    errorMessage.value = null
  }

  function finishLoading(): void {
    isLoading.value = false
    hasLoaded.value = true
  }

  function failLoading(message: string): void {
    isLoading.value = false
    errorMessage.value = message
  }

  return {
    errorMessage,
    failLoading,
    finishLoading,
    hasError,
    hasLoaded,
    isLoading,
    startLoading,
  }
})
