// @author: [Name] | FutStats
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
  <div class="flex flex-col gap-1">
    <!-- label -->
    <label class="text-sm font-medium text-gray-600">
      {{ props.label }}
    </label>
    <!-- select -->
    <select
      v-model="selected"
      class="border border-gray-300 rounded-lg px-3 py-2 text-sm
             bg-white text-gray-800 focus:outline-none
             focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
  </div>
</template>
