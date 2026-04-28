// @author: Camilo | FutStats
<script setup lang="ts">
// 1. External imports

// 2. Internal imports

interface Props {
  errorMessage: string | null
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'retry'): void
}>()
</script>

<template>
  <div
    v-if="isLoading || errorMessage"
    class="rounded-2xl border p-4 text-sm shadow-sm"
    :class="
      errorMessage
        ? 'border-red-200 bg-red-50 text-red-800'
        : 'border-blue-200 bg-blue-50 text-blue-800'
    "
  >
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p class="font-semibold">
        {{ errorMessage ?? 'Loading the latest FutStats data...' }}
      </p>

      <button
        v-if="errorMessage"
        type="button"
        class="rounded-lg bg-red-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-red-800"
        @click="emit('retry')"
      >
        Retry
      </button>
    </div>
  </div>
</template>
