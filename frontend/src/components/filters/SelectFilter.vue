// @author: Camilo | FutStats
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  options: { value: string; label: string }[]
  modelValue: string
  label: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'All',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = computed({
  get(): string {
    return props.modelValue
  },
  set(value: string): void {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- label -->
    <label class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
      {{ props.label }}
    </label>
    <!-- select wrapper -->
    <div
      class="group relative flex items-center rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50/40 to-white px-4 py-2 shadow-lg shadow-blue-500/10 transition focus-within:border-blue-400 focus-within:shadow-blue-500/30"
    >
      <select
        v-model="selected"
        class="w-full appearance-none bg-transparent text-sm font-medium text-slate-900 outline-none"
      >
        <!-- default option -->
        <option value="">{{ props.placeholder }}</option>
        <!-- dynamic options -->
        <option
          v-for="option in props.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span
        class="pointer-events-none text-blue-500 transition-transform group-focus-within:-translate-y-0.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  </div>
</template>
